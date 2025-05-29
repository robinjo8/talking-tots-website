
import React from 'react';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  tiles: number[];
  size: number;
  isWon: boolean;
  onTileClick: (index: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ tiles, size, isWon, onTileClick }) => {
  const getTileTextSize = () => {
    if (size === 3) return "text-lg sm:text-xl md:text-2xl lg:text-3xl";
    if (size === 4) return "text-base sm:text-lg md:text-xl lg:text-2xl";
    return "text-sm sm:text-base md:text-lg lg:text-xl";
  };

  const getGridGap = () => {
    if (size === 3) return "gap-2";
    if (size === 4) return "gap-1.5";
    return "gap-1";
  };

  const getPadding = () => {
    if (size === 3) return "p-2";
    if (size === 4) return "p-1.5";
    return "p-1";
  };

  return (
    <div 
      className={cn(
        "w-full h-full grid bg-gray-300 rounded-lg shadow-lg",
        getGridGap(),
        getPadding()
      )}
      style={{ 
        gridTemplateColumns: `repeat(${size}, 1fr)`,
      }}
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
            getTileTextSize()
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
