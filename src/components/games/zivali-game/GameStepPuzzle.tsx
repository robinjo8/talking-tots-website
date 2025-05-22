
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Puzzle } from 'lucide-react';
import { useAudioPlayback } from '@/hooks/useAudioPlayback';

interface GameStepPuzzleProps {
  onComplete: () => void;
  addPoints: (points: number) => void;
}

interface PuzzlePiece {
  id: number;
  imgSrc: string;
  position: number;
}

export function GameStepPuzzle({ onComplete, addPoints }: GameStepPuzzleProps) {
  const { playAudio } = useAudioPlayback();
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);
  
  // Create puzzle pieces
  useEffect(() => {
    const dogImage = '/lovable-uploads/958712cc-0a34-4066-a7f4-c947de96c29a.png';
    
    // Create pieces from different sections of the dog image
    const initialPieces: PuzzlePiece[] = [
      { id: 1, imgSrc: '/lovable-uploads/958712cc-0a34-4066-a7f4-c947de96c29a.png', position: 1 },
      { id: 2, imgSrc: '/lovable-uploads/958712cc-0a34-4066-a7f4-c947de96c29a.png', position: 3 },
      { id: 3, imgSrc: '/lovable-uploads/958712cc-0a34-4066-a7f4-c947de96c29a.png', position: 4 },
      { id: 4, imgSrc: '/lovable-uploads/958712cc-0a34-4066-a7f4-c947de96c29a.png', position: 2 },
    ];
    
    // Shuffle the pieces
    setPieces(initialPieces.sort(() => Math.random() - 0.5));
  }, []);
  
  // Handle piece selection/swap
  const handlePieceClick = (id: number) => {
    if (solved) return;
    
    if (selectedPiece === null) {
      setSelectedPiece(id);
    } else {
      // Swap pieces
      setPieces(prevPieces => {
        const newPieces = [...prevPieces];
        const selectedIndex = newPieces.findIndex(piece => piece.id === selectedPiece);
        const targetIndex = newPieces.findIndex(piece => piece.id === id);
        
        // Swap positions
        const temp = newPieces[selectedIndex].position;
        newPieces[selectedIndex].position = newPieces[targetIndex].position;
        newPieces[targetIndex].position = temp;
        
        return newPieces;
      });
      
      setSelectedPiece(null);
      
      // Play swap sound
      playAudio("https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/audio-besede/click.mp3");
      
      // Check if puzzle is solved
      setTimeout(() => {
        const isSolved = pieces.every(piece => piece.id === piece.position);
        if (isSolved) {
          setSolved(true);
          addPoints(20);
          playAudio("https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/audio-besede/success.mp3");
          
          setTimeout(() => {
            onComplete();
          }, 2000);
        }
      }, 100);
    }
  };
  
  return (
    <div className="bg-gradient-to-b from-blue-100 to-yellow-100 rounded-xl p-8 min-h-[60vh] flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-6 text-center">Sestavi sliko kužka</h2>
      <p className="text-lg mb-6 text-center flex items-center gap-2">
        <Puzzle className="h-5 w-5" />
        Klikni na dva dela sestavljanke, da jih zamenjaš!
      </p>
      
      <div className="w-full max-w-md mx-auto grid grid-cols-2 gap-2 md:gap-4 mb-8">
        {pieces.map((piece) => (
          <Card 
            key={piece.id}
            className={`aspect-square overflow-hidden cursor-pointer p-2 ${
              selectedPiece === piece.id ? 'border-4 border-blue-500' : solved ? 'border-4 border-green-500' : ''
            }`}
            onClick={() => handlePieceClick(piece.id)}
          >
            <div className="relative w-full h-full">
              <img
                src={piece.imgSrc}
                alt={`Puzzle piece ${piece.id}`}
                className="object-cover w-full h-full"
                style={{
                  clipPath: piece.position === 1 ? 'polygon(0 0, 100% 0, 100% 50%, 50% 50%, 50% 100%, 0 100%)' :
                           piece.position === 2 ? 'polygon(0 0, 50% 0, 50% 50%, 100% 50%, 100% 100%, 0 100%)' :
                           piece.position === 3 ? 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%, 50% 50%, 0 50%, 0 0, 50% 0)' :
                           'polygon(100% 50%, 50% 50%, 50% 0, 100% 0)'
                }}
              />
            </div>
          </Card>
        ))}
      </div>
      
      {solved && (
        <div className="animate-fade-in text-center">
          <p className="text-xl font-bold text-green-700 mb-3">Odlično! Sestavil si kužka!</p>
        </div>
      )}
      
      <div className="mt-4">
        <img 
          src="/lovable-uploads/958712cc-0a34-4066-a7f4-c947de96c29a.png" 
          alt="Completed dog puzzle"
          className="h-24 opacity-50"
        />
      </div>
    </div>
  );
}
