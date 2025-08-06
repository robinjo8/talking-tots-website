import { Play, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FourColumnMatchingItem } from "@/data/threeColumnMatchingData";
import { useFourColumnMatching } from "@/hooks/useFourColumnMatching";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";

interface FourColumnGameProps {
  items: FourColumnMatchingItem[];
  onGameComplete?: (score: number) => void;
}

export function FourColumnGame({ items, onGameComplete }: FourColumnGameProps) {
  const { gameState, selectAudio, selectWritten, selectShadow, selectOriginal, resetGame, isItemSelected, isItemCompleted } = useFourColumnMatching(items);
  const { playAudio } = useAudioPlayback();

  const playAudioFile = (audioFilename: string) => {
    const audioUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/${audioFilename}`;
    playAudio(audioUrl);
  };

  const getImageUrl = (filename: string, bucket: 'slike-sence' | 'slike') => {
    return `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/${bucket}/${filename}`;
  };

  const getAudioTileClass = (itemId: string) => {
    const baseClass = "w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 flex items-center justify-center border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105";
    if (isItemCompleted(itemId)) return `${baseClass} bg-green-100 border-green-300 opacity-60`;
    if (isItemSelected(itemId, 'audio')) return `${baseClass} bg-blue-100 border-blue-400 border-4`;
    return `${baseClass} bg-white border-gray-200 hover:border-blue-300`;
  };

  const getWrittenTileClass = (itemId: string) => {
    const baseClass = "w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 flex items-center justify-center border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 p-2";
    if (isItemCompleted(itemId)) return `${baseClass} bg-green-100 border-green-300 opacity-60`;
    if (isItemSelected(itemId, 'written')) return `${baseClass} bg-blue-100 border-blue-400 border-4`;
    return `${baseClass} bg-white border-gray-200 hover:border-blue-300`;
  };

  const getImageTileClass = (itemId: string, column: 'shadow' | 'original') => {
    const baseClass = "w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 flex items-center justify-center border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 overflow-hidden";
    if (isItemCompleted(itemId)) return `${baseClass} bg-green-100 border-green-300 opacity-60`;
    if (isItemSelected(itemId, column)) return `${baseClass} bg-blue-100 border-blue-400 border-4`;
    return `${baseClass} bg-white border-gray-200 hover:border-blue-300`;
  };

  const getFontSizeClass = (word: string) => {
    if (word.length <= 4) return "text-lg md:text-xl lg:text-2xl";
    if (word.length <= 6) return "text-base md:text-lg lg:text-xl";
    if (word.length <= 8) return "text-sm md:text-base lg:text-lg";
    return "text-xs md:text-sm lg:text-base";
  };

  // Handle game completion
  if (gameState.isComplete && onGameComplete) {
    onGameComplete(gameState.score);
  }

  if (!items.length) {
    return <div className="text-center py-8">Loading game...</div>;
  }

  return (
    <div className="w-full">
      {/* Game area */}
      <div className="relative rounded-xl p-2 md:p-4 lg:p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 lg:gap-6">
          {/* Audio Column */}
          <div className="flex flex-col gap-2 md:gap-4">
            {gameState.shuffledAudio.map((itemId, index) => {
              const item = items.find(i => i.id === itemId);
              if (!item) return null;
              
              return (
                <div
                  key={`audio-${itemId}-${index}`}
                  className={getAudioTileClass(itemId)}
                  onClick={() => {
                    selectAudio(itemId);
                    playAudioFile(item.audioFile);
                  }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 md:p-2 pointer-events-none"
                  >
                    <Play className="w-4 h-4 md:w-6 md:h-6" />
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Written Word Column */}
          <div className="flex flex-col gap-2 md:gap-4">
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
          <div className="flex flex-col gap-2 md:gap-4">
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
          <div className="flex flex-col gap-2 md:gap-4">
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