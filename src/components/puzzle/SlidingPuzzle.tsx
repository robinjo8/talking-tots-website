import React, { useState, useEffect, useCallback } from 'react';

interface SlidingPuzzleProps {
  imageUrl: string;
  onComplete: () => void;
  className?: string;
}

interface PuzzlePiece {
  id: number;
  position: number;
  isEmpty: boolean;
}

export const SlidingPuzzle: React.FC<SlidingPuzzleProps> = ({
  imageUrl,
  onComplete,
  className = ""
}) => {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  // Initialize puzzle pieces
  const initializePuzzle = useCallback(() => {
    // Create pieces (0-8, where 8 is empty)
    const initialPieces: PuzzlePiece[] = [];
    for (let i = 0; i < 9; i++) {
      initialPieces.push({
        id: i,
        position: i,
        isEmpty: i === 8 // Last piece is empty
      });
    }

    // Shuffle the puzzle (but keep it solvable)
    const shuffledPieces = [...initialPieces];
    for (let i = 0; i < 100; i++) {
      const emptyIndex = shuffledPieces.findIndex(p => p.isEmpty);
      const validMoves = getValidMoves(emptyIndex);
      if (validMoves.length > 0) {
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        // Swap with random valid piece
        [shuffledPieces[emptyIndex], shuffledPieces[randomMove]] = 
        [shuffledPieces[randomMove], shuffledPieces[emptyIndex]];
      }
    }

    setPieces(shuffledPieces);
    setIsCompleted(false);
  }, []);

  // Get valid moves for empty space
  const getValidMoves = (emptyIndex: number): number[] => {
    const moves: number[] = [];
    const row = Math.floor(emptyIndex / 3);
    const col = emptyIndex % 3;

    // Can move up
    if (row > 0) moves.push(emptyIndex - 3);
    // Can move down
    if (row < 2) moves.push(emptyIndex + 3);
    // Can move left
    if (col > 0) moves.push(emptyIndex - 1);
    // Can move right
    if (col < 2) moves.push(emptyIndex + 1);

    return moves;
  };

  // Check if puzzle is completed
  const checkCompletion = useCallback((currentPieces: PuzzlePiece[]) => {
    return currentPieces.every((piece, index) => {
      if (piece.isEmpty) return index === 8; // Empty should be at position 8
      return piece.id === index;
    });
  }, []);

  // Handle piece click
  const handlePieceClick = (clickedIndex: number) => {
    if (isCompleted) return;

    const emptyIndex = pieces.findIndex(p => p.isEmpty);
    const validMoves = getValidMoves(emptyIndex);

    if (validMoves.includes(clickedIndex)) {
      const newPieces = [...pieces];
      // Swap clicked piece with empty space
      [newPieces[emptyIndex], newPieces[clickedIndex]] = 
      [newPieces[clickedIndex], newPieces[emptyIndex]];

      setPieces(newPieces);

      // Check if completed
      if (checkCompletion(newPieces)) {
        setIsCompleted(true);
        setTimeout(() => onComplete(), 500);
      }
    }
  };

  // Initialize puzzle on mount and when imageUrl changes
  useEffect(() => {
    initializePuzzle();
  }, [imageUrl, initializePuzzle]);

  return (
    <div className={`${className} flex justify-center items-center`}>
      <div className="relative">
        {/* Silhouette background - positioned behind the puzzle */}
        <div 
          className="absolute inset-0 rounded-lg opacity-15 pointer-events-none"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.3) contrast(2)',
            zIndex: 0
          }}
        />
        
        <div className="relative grid grid-cols-3 gap-1 bg-gray-800 p-2 rounded-lg shadow-lg" style={{ zIndex: 1 }}>
          {pieces.map((piece, index) => (
            <div
              key={`${piece.id}-${index}`}
              className={`
                w-32 h-32 md:w-40 md:h-40 relative cursor-pointer
                ${piece.isEmpty ? 'bg-gray-300' : 'bg-white'}
                ${!piece.isEmpty ? 'hover:opacity-80 transition-opacity' : ''}
                rounded border-2 border-gray-600
                ${isCompleted ? 'border-dragon-green' : ''}
              `}
              onClick={() => handlePieceClick(index)}
              style={{
                backgroundImage: piece.isEmpty ? 'none' : `url(${imageUrl})`,
                backgroundSize: '300% 300%',
                backgroundPosition: piece.isEmpty ? 'center' : 
                  `${(piece.id % 3) * -100}% ${Math.floor(piece.id / 3) * -100}%`
              }}
            >
              {/* Number overlay for non-empty pieces */}
              {!piece.isEmpty && (
                <div className="absolute top-1 right-1 bg-black/70 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {piece.id + 1}
                </div>
              )}
              
              {piece.isEmpty && !isCompleted && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 bg-gray-500 rounded-full opacity-50"></div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {isCompleted && (
          <div className="absolute inset-0 bg-dragon-green/20 rounded-lg flex items-center justify-center">
            <div className="bg-white px-4 py-2 rounded-lg shadow-lg">
              <span className="text-dragon-green font-bold">Odlično!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
