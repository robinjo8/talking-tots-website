import { Play, Volume2 } from "lucide-react";
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
    const baseClass = "h-20 flex items-center justify-center border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105";
    if (isItemCompleted(itemId)) return `${baseClass} bg-green-100 border-green-300 opacity-60`;
    if (isItemSelected(itemId, 'audio')) return `${baseClass} bg-blue-100 border-blue-400 border-4`;
    return `${baseClass} bg-white border-gray-200 hover:border-blue-300`;
  };

  const getImageTileClass = (itemId: string, column: 'shadow' | 'original') => {
    const baseClass = "h-20 flex items-center justify-center border-2 rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 overflow-hidden";
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
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Poveži zvok, senco in sliko</h2>
        <p className="text-muted-foreground">Rezultat: {gameState.score}/{items.length}</p>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Audio Column */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-center mb-4 flex items-center justify-center gap-2">
            <Volume2 className="w-5 h-5" />
            Zvoki
          </h3>
          <div className="space-y-2">
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
        </div>

        {/* Shadow Images Column */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-center mb-4">Sence</h3>
          <div className="space-y-2">
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
        </div>

        {/* Original Images Column */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-center mb-4">Slike</h3>
          <div className="space-y-2">
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
      </div>

      {/* Game completion */}
      {gameState.isComplete && (
        <Card className="p-6 text-center bg-green-50 border-green-200">
          <h3 className="text-xl font-bold mb-2 text-green-800">Čestitamo!</h3>
          <p className="text-green-700 mb-4">
            Končali ste igro z rezultatom {gameState.score}/{items.length}!
          </p>
          <Button onClick={resetGame} className="bg-green-600 hover:bg-green-700">
            Igraj znova
          </Button>
        </Card>
      )}

      {/* Reset button (when not completed) */}
      {!gameState.isComplete && (
        <div className="text-center">
          <Button onClick={resetGame} variant="outline">
            Začni znova
          </Button>
        </div>
      )}
    </div>
  );
}