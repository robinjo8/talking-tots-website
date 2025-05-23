
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
      className="grid gap-1 bg-slate-200 p-3 rounded-lg shadow-lg aspect-square w-full max-w-[min(90vmin,600px)] max-h-[min(90vmin,600px)]"
      style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
    >
      {tiles.map((tile, index) => (
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
