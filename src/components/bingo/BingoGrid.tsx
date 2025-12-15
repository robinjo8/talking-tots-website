import React from 'react';
import { BingoCell } from '@/hooks/useBingoGame';
import { Check } from 'lucide-react';

interface BingoGridProps {
  grid: BingoCell[];
  drawnWord: string | null;
  showHint: boolean;
  onCellClick: (index: number) => void;
}

export const BingoGrid: React.FC<BingoGridProps> = ({
  grid,
  drawnWord,
  showHint,
  onCellClick
}) => {
  const shouldPulse = (cell: BingoCell) => {
    return showHint && 
           drawnWord && 
           cell.word.word === drawnWord && 
           !cell.isCompleted && 
           !cell.isClicked;
  };

  return (
    <div className="grid grid-cols-4 gap-2 md:gap-3 p-2 md:p-4 bg-white/20 rounded-xl backdrop-blur-sm">
      {grid.map((cell, index) => (
        <button
          key={index}
          onClick={() => onCellClick(index)}
          disabled={cell.isCompleted}
          className={`
            relative aspect-square rounded-lg overflow-hidden transition-all duration-300
            ${cell.isCompleted 
              ? 'opacity-60 cursor-not-allowed' 
              : 'hover:scale-105 cursor-pointer'
            }
            ${cell.isClicked 
              ? 'ring-4 ring-yellow-400 scale-105' 
              : ''
            }
            ${shouldPulse(cell) 
              ? 'animate-pulse ring-4 ring-orange-400' 
              : ''
            }
          `}
        >
          <img
            src={`https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/${cell.word.image}`}
            alt={cell.word.word}
            className="w-full h-full object-cover"
          />
          
          {/* Completed overlay */}
          {cell.isCompleted && (
            <div className="absolute inset-0 bg-green-500/50 flex items-center justify-center">
              <div className="bg-white rounded-full p-1 md:p-2">
                <Check className="w-4 h-4 md:w-6 md:h-6 text-green-600" />
              </div>
            </div>
          )}
          
          {/* Clicked overlay */}
          {cell.isClicked && !cell.isCompleted && (
            <div className="absolute inset-0 bg-yellow-400/30 flex items-center justify-center">
              <div className="bg-yellow-400 rounded-full p-1 md:p-2">
                <Check className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};
