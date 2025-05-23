
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SlidePuzzleProps {
  size?: number;
  className?: string;
}

const SlidePuzzle: React.FC<SlidePuzzleProps> = ({ size = 4, className }) => {
  const [tiles, setTiles] = useState<number[]>([]);
  const [emptyIndex, setEmptyIndex] = useState<number>(size * size - 1);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [moves, setMoves] = useState<number>(0);

  // Initialize the puzzle
  useEffect(() => {
    initializePuzzle();
  }, [size]);

  // Check if puzzle is solved
  useEffect(() => {
    checkWin();
  }, [tiles]);

  const initializePuzzle = () => {
    const initialTiles = Array.from({ length: size * size - 1 }, (_, i) => i + 1);
    initialTiles.push(0); // 0 represents empty space
    
    // Shuffle the tiles
    const shuffled = shuffleTiles([...initialTiles]);
    setTiles(shuffled);
    setEmptyIndex(shuffled.indexOf(0));
    setMoves(0);
    setIsWon(false);
  };

  const shuffleTiles = (array: number[]): number[] => {
    const shuffled = [...array];
    // Fisher-Yates shuffle algorithm
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Ensure the puzzle is solvable
    if (!isSolvable(shuffled)) {
      // Swap two non-empty tiles to make it solvable
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

  const checkWin = () => {
    if (tiles.length === 0) return;
    
    const isCorrect = tiles.every((tile, index) => {
      if (index === tiles.length - 1) return tile === 0; // Last position should be empty
      return tile === index + 1;
    });
    
    setIsWon(isCorrect);
  };

  const handleTileClick = (index: number) => {
    if (isWon || tiles[index] === 0) return;

    const row = Math.floor(index / size);
    const col = index % size;
    const emptyRow = Math.floor(emptyIndex / size);
    const emptyCol = emptyIndex % size;

    // Check if the clicked tile is adjacent to the empty space
    const isAdjacent = 
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow);

    if (isAdjacent) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      
      setTiles(newTiles);
      setEmptyIndex(index);
      setMoves(moves + 1);
    }
  };

  return (
    <div className={cn("flex flex-col items-center justify-center w-full h-full", className)}>
      <div className="flex justify-between items-center w-full max-w-sm mb-4 px-4">
        <div className="text-sm font-medium">
          Poteze: {moves}
        </div>
        <button
          onClick={initializePuzzle}
          className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
        >
          Nova igra
        </button>
      </div>

      <div 
        className="grid gap-1 bg-muted p-2 rounded-lg shadow-lg w-full max-w-sm aspect-square"
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      >
        {tiles.map((tile, index) => (
          <button
            key={index}
            className={cn(
              "aspect-square flex items-center justify-center text-lg font-bold rounded transition-all duration-200",
              tile === 0
                ? "invisible"
                : "bg-background hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
            )}
            onClick={() => handleTileClick(index)}
            disabled={tile === 0 || isWon}
          >
            {tile !== 0 && tile}
          </button>
        ))}
      </div>

      {isWon && (
        <div className="mt-4 text-center">
          <div className="text-lg font-bold text-green-600 mb-2">
            Čestitamo! 🎉
          </div>
          <div className="text-sm text-muted-foreground">
            Rešili ste sestavljanko v {moves} potezah!
          </div>
        </div>
      )}

      <div className="text-center text-muted-foreground mt-4 px-4 max-w-sm">
        <p className="text-sm">Cilj igre je urediti ploščice v pravilnem zaporedju.</p>
        <p className="text-sm">Premikaj ploščice tako, da klikneš tisto, ki jo želiš premakniti.</p>
      </div>
    </div>
  );
};

export default SlidePuzzle;
