
import React from 'react';
import { usePuzzleLogic } from '@/hooks/usePuzzleLogic';
import { useAdaptiveDifficulty } from '@/hooks/useAdaptiveDifficulty';
import { PuzzlePiece } from './PuzzlePiece';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw, Trophy, Clock, Target } from 'lucide-react';

interface AdaptivePuzzleGameProps {
  imageUrl?: string;
}

export const AdaptivePuzzleGame: React.FC<AdaptivePuzzleGameProps> = ({ imageUrl }) => {
  const { childName, childAge, difficultyConfig } = useAdaptiveDifficulty();
  const { gameState, movePiece, resetGame, getGameStats } = usePuzzleLogic(imageUrl);
  const stats = getGameStats();

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span className="text-xl text-dragon-green">
              Sestavljanka za {childName} ({childAge} let)
            </span>
            <Button onClick={resetGame} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Nova igra
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              Težavnost: {difficultyConfig.complexity} ({difficultyConfig.pieceCount} kosov)
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="h-4 w-4" />
              Pravilno: {stats.correctPieces}/{stats.totalPieces}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Čas: {Math.floor(stats.duration / 60)}:{(stats.duration % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Board */}
      <div 
        id="puzzle-game-board"
        className="relative w-full h-[600px] bg-gray-100 rounded-lg border-2 border-gray-300 overflow-hidden"
      >
        {/* Storage Area (Left) */}
        <div className="absolute left-2 top-2 bottom-2 w-40 bg-gray-200 border-2 border-gray-400 rounded-lg">
          <div className="p-2 text-center text-sm font-medium text-gray-600 border-b border-gray-400">
            Shranjevanje
          </div>
          <div className="p-2 text-xs text-center text-gray-500">
            Povleci kose sem za začasno shranjevanje
          </div>
        </div>

        {/* Assembly Area (Center) */}
        <div className="absolute left-48 top-16 w-96 h-80 bg-white border-4 border-dashed border-blue-300 rounded-lg">
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-medium text-blue-600">
            Sestavi sliko tukaj
          </div>
          
          {/* Grid lines for guidance (optional) */}
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: difficultyConfig.gridSize.rows }).map((_, row) =>
              Array.from({ length: difficultyConfig.gridSize.cols }).map((_, col) => (
                <div
                  key={`grid-${row}-${col}`}
                  className="absolute border border-gray-300"
                  style={{
                    left: col * 60,
                    top: row * 60,
                    width: 60,
                    height: 60
                  }}
                />
              ))
            )}
          </div>
        </div>

        {/* Scattered Area Instructions */}
        <div className="absolute right-4 top-4">
          <Card className="w-48">
            <CardContent className="p-3">
              <p className="text-xs text-center text-gray-600">
                Povleci kose v belo področje in jih postavi na pravo mesto!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Puzzle Pieces */}
        {gameState.pieces.map(piece => (
          <PuzzlePiece
            key={piece.id}
            piece={piece}
            onMove={movePiece}
          />
        ))}

        {/* Completion Overlay */}
        {gameState.isCompleted && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Card className="max-w-sm">
              <CardHeader>
                <CardTitle className="text-center text-2xl text-dragon-green">
                  🎉 Čestitke!
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-lg">Uspešno si sestavil/a sestavljanko!</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Čas:</strong><br />
                    {Math.floor(stats.duration / 60)}:{(stats.duration % 60).toString().padStart(2, '0')}
                  </div>
                  <div>
                    <strong>Poteze:</strong><br />
                    {stats.moveCount}
                  </div>
                </div>
                <Button onClick={resetGame} className="w-full">
                  Nova sestavljanka
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Instructions */}
      <Card className="mt-4">
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">Navodila:</h3>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>Povleci kose sestavjlanke z miško</li>
            <li>Postavi jih v belo področje na pravilno mesto</li>
            <li>Kosi se bodo obarvali zeleno, ko bodo na pravem mestu</li>
            <li>Sive kose lahko začasno shraniš v levo področje</li>
            <li>Cilj je sestaviti celotno sliko</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
