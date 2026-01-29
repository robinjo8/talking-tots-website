import React from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThreeColumnMatchingItem } from "@/data/threeColumnMatchingData";
import { useThreeColumnMatching } from "@/hooks/useThreeColumnMatching";

interface ThreeColumnGameProps {
  items: ThreeColumnMatchingItem[];
  onGameComplete?: (score: number, playedItems: ThreeColumnMatchingItem[]) => void;
  isLandscape?: boolean;
}

export function ThreeColumnGame({ items, onGameComplete, isLandscape = false }: ThreeColumnGameProps) {
  const { gameState, selectAudio, selectShadow, selectOriginal, resetGame, isItemSelected, isItemCompleted } = useThreeColumnMatching(items);

  const getImageUrl = (filename: string, bucket: 'slike-sence' | 'slike') => {
    return `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/${bucket}/${filename}`;
  };

  const baseTileClass = isLandscape 
    ? "w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 overflow-hidden bg-white"
    : "w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-44 xl:h-44 flex items-center justify-center border-2 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 overflow-hidden bg-white shadow-md";

  const getAudioTileClass = (itemId: string) => {
    if (isItemCompleted(itemId)) return `${baseTileClass} bg-green-100 border-green-300 opacity-60`;
    if (isItemSelected(itemId, 'audio')) return `${baseTileClass} bg-blue-100 border-blue-400 border-4`;
    return `${baseTileClass} bg-white border-gray-200 hover:border-blue-300`;
  };

  const getImageTileClass = (itemId: string, column: 'shadow' | 'original') => {
    const baseImageClass = isLandscape 
      ? "w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 overflow-hidden"
      : "w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 xl:w-44 xl:h-44 flex items-center justify-center border-2 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 overflow-hidden";
    if (isItemCompleted(itemId)) return `${baseImageClass} bg-green-100 border-green-300 opacity-60`;
    if (isItemSelected(itemId, column)) return `${baseImageClass} bg-blue-100 border-blue-400 border-4`;
    return `${baseImageClass} bg-white border-gray-200 hover:border-blue-300`;
  };

  // Handle game completion with useEffect to avoid state update during render
  React.useEffect(() => {
    if (gameState.isComplete && onGameComplete) {
      onGameComplete(gameState.score, items);
    }
  }, [gameState.isComplete, onGameComplete, gameState.score, items]);

  if (!items.length) {
    return <div className="text-center py-8">Loading game...</div>;
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      {/* Game area */}
      <div className={`relative rounded-xl ${isLandscape ? 'w-full max-w-4xl p-1' : 'p-4 md:p-6 lg:p-8'}`}>
        <div className={`grid grid-cols-3 justify-items-center ${isLandscape ? 'gap-1' : 'gap-2 sm:gap-3 md:gap-6 lg:gap-8 xl:gap-10'}`}>
          {/* Audio Column */}
          <div className={`flex flex-col ${isLandscape ? 'gap-1' : 'gap-1 sm:gap-2 md:gap-4'}`}>
            {gameState.shuffledAudio.map((itemId, index) => {
              const item = items.find(i => i.id === itemId);
              if (!item) return null;
              
              return (
                <div
                  key={`audio-${itemId}-${index}`}
                  className={getAudioTileClass(itemId)}
                  onClick={() => selectAudio(itemId)}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className={isLandscape ? "p-0.5 pointer-events-none" : "p-2 md:p-3 pointer-events-none"}
                  >
                    <Play className={isLandscape ? "w-3 h-3" : "w-5 h-5 sm:w-6 sm:h-6 md:w-10 md:h-10 lg:w-12 lg:h-12"} />
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Shadow Images Column */}
          <div className={`flex flex-col ${isLandscape ? 'gap-1' : 'gap-1 sm:gap-2 md:gap-4'}`}>
            {gameState.shuffledShadows.map((itemId, index) => {
              const item = items.find(i => i.id === itemId);
              if (!item) return null;
              
              return (
                <div
                  key={`shadow-${itemId}-${index}`}
                  className={getImageTileClass(itemId, 'shadow')}
                  onClick={() => selectShadow(itemId)}
                >
                  <img
                    src={getImageUrl(item.shadowImage, 'slike-sence')}
                    alt={`Senca ${item.word}`}
                    className="w-full h-full object-contain p-1"
                  />
                </div>
              );
            })}
          </div>

          {/* Original Images Column */}
          <div className={`flex flex-col ${isLandscape ? 'gap-1' : 'gap-1 sm:gap-2 md:gap-4'}`}>
            {gameState.shuffledOriginals.map((itemId, index) => {
              const item = items.find(i => i.id === itemId);
              if (!item) return null;
              
              return (
                <div
                  key={`original-${itemId}-${index}`}
                  className={getImageTileClass(itemId, 'original')}
                  onClick={() => selectOriginal(itemId)}
                >
                  <img
                    src={getImageUrl(item.originalImage, 'slike')}
                    alt={item.word}
                    className="w-full h-full object-contain p-1"
                  />
                </div>
              );
            })}
          </div>
        </div>


        {/* Progress indicator */}
        {!gameState.isComplete && (
          <div className="mt-6 text-center">
            <div className={`bg-white/80 rounded-full h-2 mx-auto ${isLandscape ? 'w-48' : 'w-full bg-muted'}`}>
              <div 
                className="bg-dragon-green h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(gameState.score / items.length) * 100}%` 
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}