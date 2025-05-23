
import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Undo, Lightbulb, HelpCircle, Play, RotateCcw } from 'lucide-react';

interface SlidePuzzleProps {
  className?: string;
}

interface GameState {
  tiles: number[];
  emptyIndex: number;
  moves: number;
  time: number;
  isWon: boolean;
  isPlaying: boolean;
}

interface Move {
  tiles: number[];
  emptyIndex: number;
  moves: number;
}

const SlidePuzzle: React.FC<SlidePuzzleProps> = ({ className }) => {
  const [size, setSize] = useState<number>(4);
  const [gameState, setGameState] = useState<GameState>({
    tiles: [],
    emptyIndex: 0,
    moves: 0,
    time: 0,
    isWon: false,
    isPlaying: false
  });
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [bestTimes, setBestTimes] = useState<Record<number, number>>({});
  const [showInstructions, setShowInstructions] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState.isPlaying && !gameState.isWon) {
      interval = setInterval(() => {
        setGameState(prev => ({ ...prev, time: prev.time + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState.isPlaying, gameState.isWon]);

  // Load best times from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('slidePuzzleBestTimes');
    if (saved) {
      setBestTimes(JSON.parse(saved));
    }
  }, []);

  // Save best times to localStorage
  const saveBestTime = useCallback((gridSize: number, time: number) => {
    const newBestTimes = { ...bestTimes };
    if (!newBestTimes[gridSize] || time < newBestTimes[gridSize]) {
      newBestTimes[gridSize] = time;
      setBestTimes(newBestTimes);
      localStorage.setItem('slidePuzzleBestTimes', JSON.stringify(newBestTimes));
    }
  }, [bestTimes]);

  // Initialize puzzle
  const initializePuzzle = useCallback(() => {
    const totalTiles = size * size;
    const initialTiles = Array.from({ length: totalTiles - 1 }, (_, i) => i + 1);
    initialTiles.push(0); // 0 represents empty space
    
    // Shuffle tiles
    const shuffled = shuffleTiles([...initialTiles]);
    
    setGameState({
      tiles: shuffled,
      emptyIndex: shuffled.indexOf(0),
      moves: 0,
      time: 0,
      isWon: false,
      isPlaying: false
    });
    setMoveHistory([]);
  }, [size]);

  // Initialize when size changes
  useEffect(() => {
    initializePuzzle();
  }, [initializePuzzle]);

  const shuffleTiles = (array: number[]): number[] => {
    const shuffled = [...array];
    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Ensure puzzle is solvable
    if (!isSolvable(shuffled)) {
      if (shuffled[0] !== 0 && shuffled[1] !== 0) {
        [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
      } else if (shuffled[2] !== 0 && shuffled[3] !== 0) {
        [shuffled[2], shuffled[3]] = [shuffled[3], shuffled[2]];
      }
    }
    
    return shuffled;
  };

  const isSolvable = (puzzle: number[]): boolean => {
    let inversions = 0;
    const filtered = puzzle.filter(tile => tile !== 0);
    
    for (let i = 0; i < filtered.length - 1; i++) {
      for (let j = i + 1; j < filtered.length; j++) {
        if (filtered[i] > filtered[j]) {
          inversions++;
        }
      }
    }
    
    return inversions % 2 === 0;
  };

  const checkWin = useCallback((tiles: number[]) => {
    if (tiles.length === 0) return false;
    
    return tiles.every((tile, index) => {
      if (index === tiles.length - 1) return tile === 0;
      return tile === index + 1;
    });
  }, []);

  const handleTileClick = (index: number) => {
    if (gameState.isWon || gameState.tiles[index] === 0) return;

    const row = Math.floor(index / size);
    const col = index % size;
    const emptyRow = Math.floor(gameState.emptyIndex / size);
    const emptyCol = gameState.emptyIndex % size;

    const isAdjacent = 
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow);

    if (isAdjacent) {
      // Save current state to history before making move
      setMoveHistory(prev => [...prev, {
        tiles: [...gameState.tiles],
        emptyIndex: gameState.emptyIndex,
        moves: gameState.moves
      }]);

      const newTiles = [...gameState.tiles];
      [newTiles[index], newTiles[gameState.emptyIndex]] = [newTiles[gameState.emptyIndex], newTiles[index]];
      
      const newMoves = gameState.moves + 1;
      const isWon = checkWin(newTiles);
      
      setGameState(prev => ({
        ...prev,
        tiles: newTiles,
        emptyIndex: index,
        moves: newMoves,
        isWon,
        isPlaying: !isWon && (prev.isPlaying || newMoves === 1)
      }));

      // Save best time if won
      if (isWon && gameState.time > 0) {
        saveBestTime(size, gameState.time);
      }
    }
  };

  const handleUndo = () => {
    if (moveHistory.length === 0) return;
    
    const lastMove = moveHistory[moveHistory.length - 1];
    setGameState(prev => ({
      ...prev,
      tiles: lastMove.tiles,
      emptyIndex: lastMove.emptyIndex,
      moves: lastMove.moves,
      isWon: false
    }));
    setMoveHistory(prev => prev.slice(0, -1));
  };

  const handleHint = () => {
    if (gameState.isWon) return;
    
    // Find a tile that can move towards correct position
    for (let i = 0; i < gameState.tiles.length; i++) {
      const tile = gameState.tiles[i];
      if (tile === 0) continue;
      
      const currentRow = Math.floor(i / size);
      const currentCol = i % size;
      const targetRow = Math.floor((tile - 1) / size);
      const targetCol = (tile - 1) % size;
      
      if (currentRow !== targetRow || currentCol !== targetCol) {
        // Check if this tile can move (is adjacent to empty space)
        const emptyRow = Math.floor(gameState.emptyIndex / size);
        const emptyCol = gameState.emptyIndex % size;
        
        const isAdjacent = 
          (Math.abs(currentRow - emptyRow) === 1 && currentCol === emptyCol) ||
          (Math.abs(currentCol - emptyCol) === 1 && currentRow === emptyRow);
        
        if (isAdjacent) {
          // Highlight this tile briefly
          const tileElement = document.querySelector(`[data-tile-index="${i}"]`);
          if (tileElement) {
            tileElement.classList.add('animate-pulse', 'ring-2', 'ring-yellow-400');
            setTimeout(() => {
              tileElement.classList.remove('animate-pulse', 'ring-2', 'ring-yellow-400');
            }, 1500);
          }
          break;
        }
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNewGame = () => {
    initializePuzzle();
  };

  return (
    <div className={cn("h-full w-full flex flex-col", className)}>
      {/* Header Controls */}
      <div className="flex-shrink-0 p-2 bg-background/80 backdrop-blur-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 max-w-2xl mx-auto">
          {/* Size Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium whitespace-nowrap">Velikost:</span>
            <Select value={size.toString()} onValueChange={(value) => setSize(parseInt(value))}>
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3×3</SelectItem>
                <SelectItem value="4">4×4</SelectItem>
                <SelectItem value="5">5×5</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Game Stats */}
          <div className="flex items-center gap-4 text-sm">
            <span>Čas: {formatTime(gameState.time)}</span>
            <span>Poteze: {gameState.moves}</span>
            {bestTimes[size] && (
              <span className="text-green-600">
                Rekord: {formatTime(bestTimes[size])}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleUndo}
              disabled={moveHistory.length === 0}
              className="h-8 px-2"
            >
              <Undo className="h-3 w-3" />
              <span className="hidden sm:inline ml-1">Razveljavi</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleHint}
              disabled={gameState.isWon}
              className="h-8 px-2"
            >
              <Lightbulb className="h-3 w-3" />
              <span className="hidden sm:inline ml-1">Namig</span>
            </Button>
            
            <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 px-2">
                  <HelpCircle className="h-3 w-3" />
                  <span className="hidden sm:inline ml-1">Kako igrati</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Kako igrati drsne številke</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 text-sm">
                  <p><strong>Cilj:</strong> Razvrstite številke v pravilnem vrstnem redu od 1 do {size * size - 1}.</p>
                  <p><strong>Kako:</strong> Kliknite na ploščico, ki se dotika praznega prostora, da jo premaknete.</p>
                  <p><strong>Zmaga:</strong> Ko so vse številke urejene in je prazen prostor v spodnjem desnem kotu.</p>
                  <p><strong>Namigi:</strong> Uporabite gumb "Namig" za pomoč ali "Razveljavi" za razveljavitev zadnje poteze.</p>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewGame}
              className="h-8 px-2"
            >
              <RotateCcw className="h-3 w-3" />
              <span className="hidden sm:inline ml-1">Nova igra</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="flex-1 flex items-center justify-center p-2 min-h-0">
        <div 
          className="grid gap-1 bg-slate-200 p-3 rounded-lg shadow-lg aspect-square w-full max-w-[min(90vmin,600px)] max-h-[min(90vmin,600px)]"
          style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
        >
          {gameState.tiles.map((tile, index) => (
            <button
              key={index}
              data-tile-index={index}
              className={cn(
                "aspect-square flex items-center justify-center font-bold rounded transition-all duration-200 border-2",
                tile === 0
                  ? "invisible"
                  : "bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-md active:scale-95 cursor-pointer text-blue-900",
                "text-lg sm:text-xl md:text-2xl"
              )}
              onClick={() => handleTileClick(index)}
              disabled={tile === 0 || gameState.isWon}
            >
              {tile !== 0 && tile}
            </button>
          ))}
        </div>
      </div>

      {/* Win Message */}
      {gameState.isWon && (
        <div className="flex-shrink-0 p-4 text-center bg-green-50 border-t border-green-200">
          <div className="text-lg font-bold text-green-700 mb-1">
            Čestitamo! 🎉
          </div>
          <div className="text-sm text-green-600">
            Rešili ste sestavljanko v {gameState.moves} potezah in {formatTime(gameState.time)}!
            {bestTimes[size] === gameState.time && (
              <span className="block font-semibold text-yellow-600">🏆 Nov rekord!</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SlidePuzzle;
