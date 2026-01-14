import { Play, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FourColumnMatchingItem } from "@/data/threeColumnMatchingData";
import { useFourColumnMatching } from "@/hooks/useFourColumnMatching";

interface FourColumnGameProps {
  items: FourColumnMatchingItem[];
  onGameComplete?: (score: number, playedItems: FourColumnMatchingItem[]) => void;
  isLandscape?: boolean;
}

export function FourColumnGame({ items, onGameComplete, isLandscape = false }: FourColumnGameProps) {
  const { gameState, selectAudio, selectWritten, selectShadow, selectOriginal, resetGame, isItemSelected, isItemCompleted } = useFourColumnMatching(items);

  const getImageUrl = (filename: string, bucket: 'slike-sence' | 'slike') => {
    return `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/${bucket}/${filename}`;
  };

  const baseTileClass = isLandscape 
    ? "w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 overflow-hidden bg-white"
    : "w-20 h-20 sm:w-24 sm:h-24 md:w-48 md:h-48 lg:w-52 lg:h-52 flex items-center justify-center border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 overflow-hidden bg-white";

  const getAudioTileClass = (itemId: string) => {
    if (isItemCompleted(itemId)) return `${baseTileClass} border-green-300 bg-green-100 opacity-60`;
    if (isItemSelected(itemId, 'audio')) return `${baseTileClass} border-blue-400 bg-blue-100 border-4`;
    return `${baseTileClass} border-gray-200 hover:border-blue-300`;
  };

  const getWrittenTileClass = (itemId: string) => {
    const writtenBase = isLandscape 
      ? "w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 overflow-hidden bg-white p-1"
      : "w-20 h-20 sm:w-24 sm:h-24 md:w-48 md:h-48 lg:w-52 lg:h-52 flex items-center justify-center border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 overflow-hidden bg-white p-1";
    if (isItemCompleted(itemId)) return `${writtenBase} border-green-300 bg-green-100 opacity-60`;
    if (isItemSelected(itemId, 'written')) return `${writtenBase} border-blue-400 bg-blue-100 border-4`;
    return `${writtenBase} border-gray-200 hover:border-blue-300`;
  };

  const getImageTileClass = (itemId: string, column: 'shadow' | 'original') => {
    if (isItemCompleted(itemId)) return `${baseTileClass} border-green-300 bg-green-100 opacity-60`;
    if (isItemSelected(itemId, column)) return `${baseTileClass} border-blue-400 bg-blue-100 border-4`;
    return `${baseTileClass} border-gray-200 hover:border-blue-300`;
  };

  const getFontSizeClass = (word: string) => {
    if (isLandscape) {
      if (word.length <= 3) return "text-xs";
      if (word.length <= 5) return "text-xs";
      return "text-[10px]";
    }
    if (word.length <= 3) return "text-xs sm:text-sm md:text-xl lg:text-2xl";
    if (word.length <= 5) return "text-xs sm:text-xs md:text-lg lg:text-xl";
    if (word.length <= 7) return "text-xs sm:text-xs md:text-base lg:text-lg";
    if (word.length <= 9) return "text-xs sm:text-xs md:text-sm lg:text-base";
    return "text-xs sm:text-xs md:text-xs lg:text-sm";
  };

  // Handle game completion
  if (gameState.isComplete && onGameComplete) {
    onGameComplete(gameState.score, items);
  }

  if (!items.length) {
    return <div className="text-center py-8">Loading game...</div>;
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      {/* Game area */}
      <div className={`relative rounded-xl w-full max-w-4xl ${isLandscape ? 'p-1' : 'p-2 md:p-4 lg:p-6'}`}>
        <div className={`grid grid-cols-4 justify-items-center ${isLandscape ? 'gap-1' : 'gap-1 sm:gap-2 md:gap-4 lg:gap-6'}`}>
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
                    className={isLandscape ? "p-0.5 pointer-events-none" : "p-1 md:p-2 pointer-events-none"}
                  >
                    <Play className={isLandscape ? "w-3 h-3" : "w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6"} />
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Written Word Column */}
          <div className={`flex flex-col ${isLandscape ? 'gap-1' : 'gap-1 sm:gap-2 md:gap-4'}`}>
            {gameState.shuffledWritten.map((itemId, index) => {
              const item = items.find(i => i.id === itemId);
              if (!item) return null;
              
              return (
                <div
                  key={`written-${itemId}-${index}`}
                  className={getWrittenTileClass(itemId)}
                  onClick={() => selectWritten(itemId)}
                >
                  <span className={`font-bold text-center ${getFontSizeClass(item.writtenWord)}`}>
                    {item.writtenWord}
                  </span>
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

        {/* Game completion indicator */}
        {gameState.isComplete && (
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2 text-dragon-green font-bold text-lg">
              <Trophy className="h-6 w-6" />
              <span>Uspešno dokončano!</span>
            </div>
          </div>
        )}

        {/* Progress indicator */}
        {!gameState.isComplete && (
          <div className="mt-6 text-center">
            <div className="w-full bg-muted rounded-full h-2">
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