
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";

interface MemoryCardProps {
  id: string;
  imageUrl: string | null;
  audioUrl: string | null;
  flipped: boolean;
  matched: boolean;
  onClick: () => void;
  disabled: boolean;
}

export function MemoryCard({ 
  id, 
  imageUrl, 
  audioUrl, 
  flipped, 
  matched, 
  onClick,
  disabled
}: MemoryCardProps) {
  const { playAudio } = useAudioPlayback();
  const [isLoading, setIsLoading] = useState(true);

  const handleCardClick = () => {
    if (!disabled && !flipped && !matched) {
      onClick();
      
      // Play audio when card is flipped
      if (audioUrl) {
        playAudio(audioUrl);
      }
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div
      className="perspective-1000 h-full w-full"
      onClick={handleCardClick}
    >
      <div
        className={cn(
          "relative w-full h-full transition-all duration-500 transform-style-preserve-3d",
          flipped || matched ? "rotate-y-180" : ""
        )}
        style={{ 
          transformStyle: "preserve-3d",
          perspective: "1000px"
        }}
      >
        {/* Front of card (hidden when flipped) */}
        <div
          className={cn(
            "absolute w-full h-full backface-hidden bg-gradient-to-br from-app-purple/10 to-app-blue/10 rounded-md border-2 border-app-purple/30 flex items-center justify-center",
            flipped || matched ? "invisible" : ""
          )}
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="text-4xl font-bold text-app-purple/50">?</div>
        </div>

        {/* Back of card (shown when flipped) */}
        <div
          className={cn(
            "absolute w-full h-full backface-hidden bg-white rounded-md border-2",
            matched ? "border-dragon-green/50" : "border-app-purple/30",
            "flex items-center justify-center overflow-hidden"
          )}
          style={{ 
            backfaceVisibility: "hidden", 
            transform: "rotateY(180deg)"
          }}
        >
          {isLoading && <div className="animate-pulse bg-gray-200 w-full h-full" />}
          
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Spominska kartica"
              className={cn(
                "object-contain w-full h-full p-2",
                isLoading ? "opacity-0" : "opacity-100"
              )}
              onLoad={handleImageLoad}
              onError={handleImageLoad}
            />
          )}
          
          {!imageUrl && !isLoading && (
            <div className="text-lg text-center p-2 text-gray-500">
              Ni slike
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
