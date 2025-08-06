import { Play, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThreeColumnMatchingItem } from "@/data/threeColumnMatchingData";
import { useThreeColumnMatching } from "@/hooks/useThreeColumnMatching";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";

interface ThreeColumnGameProps {
  items: ThreeColumnMatchingItem[];
  onGameComplete?: (score: number) => void;
}

export function ThreeColumnGame({ items, onGameComplete }: ThreeColumnGameProps) {
  const { gameState, selectAudio, selectShadow, selectOriginal, resetGame, isItemSelected, isItemCompleted } = useThreeColumnMatching(items);
  const { playAudio } = useAudioPlayback();

  const playAudioFile = (audioFilename: string) => {
    const audioUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/${audioFilename}`;
    playAudio(audioUrl);
  };

  const getImageUrl = (filename: string, bucket: 'slike-sence' | 'slike') => {
    return `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/${bucket}/${filename}`;
  };

  const getAudioTileClass = (itemId: string) => {
    const baseClass = "w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 flex items-center justify-center border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105";
    if (isItemCompleted(itemId)) return `${baseClass} bg-green-100 border-green-300 opacity-60`;
    if (isItemSelected(itemId, 'audio')) return `${baseClass} bg-blue-100 border-blue-400 border-4`;
    return `${baseClass} bg-white border-gray-200 hover:border-blue-300`;
  };

  const getImageTileClass = (itemId: string, column: 'shadow' | 'original') => {
    const baseClass = "w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 flex items-center justify-center border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 overflow-hidden";
    if (isItemCompleted(itemId)) return `${baseClass} bg-green-100 border-green-300 opacity-60`;
    if (isItemSelected(itemId, column)) return `${baseClass} bg-blue-100 border-blue-400 border-4`;
    return `${baseClass} bg-white border-gray-200 hover:border-blue-300`;
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
      <div className="relative rounded-xl p-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Audio Column */}
          <div className="flex flex-col gap-4">
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
                    className="p-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      playAudioFile(item.audioFile);
                    }}
                  >
                    <Play className="w-6 h-6" />
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Shadow Images Column */}
          <div className="flex flex-col gap-4">
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
          <div className="flex flex-col gap-4">
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