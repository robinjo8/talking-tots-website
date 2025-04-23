
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
    }
  };
  
  // Play audio when card is flipped - move to an effect that runs when flipped changes
  // This ensures audio plays even when the card is flipped programmatically
  useState(() => {
    if (flipped && audioUrl && !matched) {
      // Small delay to ensure this happens after the card flip animation starts
      setTimeout(() => {
        playAudio(audioUrl);
      }, 100);
    }
  });

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="flip-card" onClick={handleCardClick}>
      <div className={cn("flip-card-inner", flipped || matched ? "flipped" : "")}>
        {/* Front of card (hidden when flipped) */}
        <div className="flip-card-front">
          <div className="text-4xl font-bold text-dragon-green">?</div>
        </div>

        {/* Back of card (shown when flipped) */}
        <div className={cn("flip-card-back", matched && "matched")}>
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
