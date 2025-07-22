
import React, { useState } from 'react';
import { PuzzlePiece as PuzzlePieceType } from '@/hooks/usePuzzleLogic';

interface PuzzlePieceProps {
  piece: PuzzlePieceType;
  onMove: (pieceId: string, position: { x: number; y: number }, area: 'assembly' | 'storage' | 'scattered') => void;
  isDragging?: boolean;
}

export const PuzzlePiece: React.FC<PuzzlePieceProps> = ({ piece, onMove }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const gameBoard = document.getElementById('puzzle-game-board');
    if (!gameBoard) return;

    const gameBoardRect = gameBoard.getBoundingClientRect();
    const newX = e.clientX - gameBoardRect.left - dragOffset.x;
    const newY = e.clientY - gameBoardRect.top - dragOffset.y;

    // Determine which area the piece is in
    let area: 'assembly' | 'storage' | 'scattered' = 'scattered';
    
    // Assembly area (center white area)
    if (newX >= 200 && newX <= 600 && newY >= 100 && newY <= 500) {
      area = 'assembly';
    }
    // Storage area (left gray area)
    else if (newX >= 20 && newX <= 180) {
      area = 'storage';
    }

    onMove(piece.id, { x: newX, y: newY }, area);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const pieceStyle: React.CSSProperties = {
    position: 'absolute',
    left: piece.currentPosition.x,
    top: piece.currentPosition.y,
    width: 50,
    height: 50,
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex: isDragging ? 1000 : 1,
    transform: isDragging ? 'scale(1.05)' : 'scale(1)',
    transition: isDragging ? 'none' : 'transform 0.2s ease'
  };

  return (
    <div
      className={`
        bg-white border-2 rounded-lg shadow-md select-none
        ${piece.isPlacedCorrectly 
          ? 'border-green-500 bg-green-50' 
          : piece.isInAssemblyArea 
            ? 'border-blue-400' 
            : 'border-gray-300'
        }
        ${isDragging ? 'shadow-xl' : 'hover:shadow-lg'}
      `}
      style={pieceStyle}
      onMouseDown={handleMouseDown}
    >
      {/* Piece content - could be image section or placeholder */}
      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-600">
        {piece.id.split('-')[1]}
      </div>
      
      {/* Visual indicator for correct placement */}
      {piece.isPlacedCorrectly && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </div>
      )}
    </div>
  );
};
