import React from 'react';
import { BingoCell } from '@/hooks/useBingoGame';
import { Check } from 'lucide-react';

interface BingoGridProps {
  grid: BingoCell[];
  drawnWord: string | null;
  showHint: boolean;
  onCellClick: (index: number) => void;
  winningLine?: number[] | null;
}

export const BingoGrid: React.FC<BingoGridProps> = ({
  grid,
  drawnWord,
  showHint,
  onCellClick,
  winningLine = null
}) => {
  const shouldPulse = (cell: BingoCell) => {
    return showHint && 
           drawnWord && 
           cell.word.word === drawnWord && 
           !cell.isCompleted && 
           !cell.isClicked;
  };

  const isWinningCell = (index: number) => {
    return winningLine && winningLine.includes(index);
  };

  return (
    <div className="grid grid-cols-4 gap-1 md:gap-2 p-2 bg-white/20 rounded-xl backdrop-blur-sm max-w-[320px] md:max-w-[400px]">
      {grid.map((cell, index) => (
        <button
          key={index}
          onClick={() => onCellClick(index)}
          disabled={cell.isCompleted}
          className={`
            relative w-[72px] h-[72px] md:w-[90px] md:h-[90px] rounded-lg overflow-hidden transition-all duration-300
            ${cell.isCompleted 
              ? 'opacity-60 cursor-not-allowed' 
              : 'hover:scale-105 cursor-pointer'
            }
            ${cell.isClicked 
              ? 'ring-2 ring-yellow-400 scale-105' 
              : ''
            }
            ${shouldPulse(cell) 
              ? 'animate-pulse ring-2 ring-orange-400' 
              : ''
            }
            ${isWinningCell(index) 
              ? 'ring-4 ring-yellow-400 scale-105 opacity-100' 
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
            <div className={`absolute inset-0 flex items-center justify-center ${isWinningCell(index) ? 'bg-yellow-500/50' : 'bg-green-500/50'}`}>
              <div className="bg-white rounded-full p-1">
                <Check className={`w-3 h-3 md:w-4 md:h-4 ${isWinningCell(index) ? 'text-yellow-600' : 'text-green-600'}`} />
              </div>
            </div>
          )}
          
          {/* Clicked overlay */}
          {cell.isClicked && !cell.isCompleted && (
            <div className="absolute inset-0 bg-yellow-400/30 flex items-center justify-center">
              <div className="bg-yellow-400 rounded-full p-1">
                <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />
              </div>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};
