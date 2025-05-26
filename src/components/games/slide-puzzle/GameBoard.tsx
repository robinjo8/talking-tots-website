
import React from 'react';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  tiles: number[];
  size: number;
  isWon: boolean;
  onTileClick: (index: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ tiles, size, isWon, onTileClick }) => {
  return (
    <div 
      className="w-full h-full grid gap-1 bg-gray-300 p-2 rounded-lg shadow-lg"
      style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
    >
      {tiles.map((tile, index) => (
        <button
          key={index}
          data-tile-index={index}
          className={cn(
            "aspect-square flex items-center justify-center font-bold rounded transition-all duration-200 border-2 text-blue-900",
            tile === 0
              ? "invisible"
              : "bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-md active:scale-95 cursor-pointer",
            // Responsive text sizing based on grid size and screen size
            size === 3 && "text-lg sm:text-xl md:text-2xl lg:text-3xl",
            size === 4 && "text-base sm:text-lg md:text-xl lg:text-2xl", 
            size === 5 && "text-sm sm:text-base md:text-lg lg:text-xl"
          )}
          onClick={() => onTileClick(index)}
          disabled={tile === 0 || isWon}
        >
          {tile !== 0 && tile}
        </button>
      ))}
    </div>
  );
};

export default GameBoard;
