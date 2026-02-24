import React from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThreeColumnMatchingItem } from "@/data/threeColumnMatchingData";
import { useThreeColumnMatching } from "@/hooks/useThreeColumnMatching";
import { useDynamicTileSize } from "@/hooks/useDynamicTileSize";

interface ThreeColumnGameProps {
  items: ThreeColumnMatchingItem[];
  onGameComplete?: (score: number, playedItems: ThreeColumnMatchingItem[]) => void;
  isLandscape?: boolean;
}

export function ThreeColumnGame({ items, onGameComplete, isLandscape = false }: ThreeColumnGameProps) {
  const { gameState, selectAudio, selectShadow, selectOriginal, resetGame, isItemSelected, isItemCompleted } = useThreeColumnMatching(items);
  
  const tileSize = useDynamicTileSize({
    numColumns: 3,
    numRows: items.length || 3,
    isLandscape,
  });

  const getImageUrl = (filename: string, bucket: 'slike-sence' | 'slike') => {
    return `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/${bucket}/${filename}`;
  };

  const baseTileStyle: React.CSSProperties = { width: tileSize, height: tileSize };

  const baseTileClass = "flex items-center justify-center border-2 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105 overflow-hidden bg-white shadow-md";

  const getAudioTileClass = (itemId: string) => {
    if (isItemCompleted(itemId)) return `${baseTileClass} bg-green-100 border-green-300 opacity-60`;
    if (isItemSelected(itemId, 'audio')) return `${baseTileClass} bg-blue-100 border-blue-400 border-4`;
    return `${baseTileClass} bg-white border-gray-200 hover:border-blue-300`;
  };

  const getImageTileClass = (itemId: string, column: 'shadow' | 'original') => {
    if (isItemCompleted(itemId)) return `${baseTileClass} bg-green-100 border-green-300 opacity-60`;
    if (isItemSelected(itemId, column)) return `${baseTileClass} bg-blue-100 border-blue-400 border-4`;
    return `${baseTileClass} bg-white border-gray-200 hover:border-blue-300`;
  };

  const iconSize = Math.max(Math.floor(tileSize * 0.3), 16);

  React.useEffect(() => {
    if (gameState.isComplete && onGameComplete) {
      onGameComplete(gameState.score, items);
    }
  }, [gameState.isComplete, onGameComplete, gameState.score, items]);

  if (!items.length) {
    return <div className="text-center py-8">Loading game...</div>;
  }

  const gapSize = isLandscape ? 4 : 16;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className={`relative rounded-xl ${isLandscape ? 'w-full max-w-4xl p-1' : 'p-2'}`}>
        <div className="grid grid-cols-3 justify-items-center" style={{ gap: `${gapSize}px` }}>
          {/* Audio Column */}
          <div className="flex flex-col" style={{ gap: `${gapSize}px` }}>
            {gameState.shuffledAudio.map((itemId, index) => {
              const item = items.find(i => i.id === itemId);
              if (!item) return null;
              return (
                <div key={`audio-${itemId}-${index}`} className={getAudioTileClass(itemId)} style={baseTileStyle} onClick={() => selectAudio(itemId)}>
                  <Button variant="ghost" size="sm" className="p-2 pointer-events-none">
                    <Play style={{ width: iconSize, height: iconSize }} />
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Shadow Images Column */}
          <div className="flex flex-col" style={{ gap: `${gapSize}px` }}>
            {gameState.shuffledShadows.map((itemId, index) => {
              const item = items.find(i => i.id === itemId);
              if (!item) return null;
              return (
                <div key={`shadow-${itemId}-${index}`} className={getImageTileClass(itemId, 'shadow')} style={baseTileStyle} onClick={() => selectShadow(itemId)}>
                  <img src={getImageUrl(item.shadowImage, 'slike-sence')} alt={`Senca ${item.word}`} className="w-full h-full object-contain p-1" />
                </div>
              );
            })}
          </div>

          {/* Original Images Column */}
          <div className="flex flex-col" style={{ gap: `${gapSize}px` }}>
            {gameState.shuffledOriginals.map((itemId, index) => {
              const item = items.find(i => i.id === itemId);
              if (!item) return null;
              return (
                <div key={`original-${itemId}-${index}`} className={getImageTileClass(itemId, 'original')} style={baseTileStyle} onClick={() => selectOriginal(itemId)}>
                  <img src={getImageUrl(item.originalImage, 'slike')} alt={item.word} className="w-full h-full object-contain p-1" />
                </div>
              );
            })}
          </div>
        </div>

        {!gameState.isComplete && (
          <div className="mt-4 text-center">
            <div className={`bg-white/80 rounded-full h-2 mx-auto ${isLandscape ? 'w-48' : 'w-full bg-muted'}`}>
              <div className="bg-dragon-green h-2 rounded-full transition-all duration-300" style={{ width: `${(gameState.score / items.length) * 100}%` }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
