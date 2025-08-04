
import { useEffect } from "react";
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

  const handleCardClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!disabled && !flipped && !matched) {
      // Play audio immediately when card is flipped
      if (audioUrl) {
        console.log("Playing audio on card flip:", audioUrl);
        playAudio(audioUrl);
      }
      onClick();
    }
  };

  return (
    <div 
      className="flip-card" 
      onClick={handleCardClick}
      onTouchEnd={handleCardClick}
      style={{
        touchAction: 'manipulation',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent'
      }}
    >
      <div className={cn("flip-card-inner", flipped || matched ? "flipped" : "")}>
        <div className="flip-card-front">
          <div className="text-4xl font-bold text-dragon-green">?</div>
        </div>

        <div className={cn("flip-card-back", matched && "matched")}>
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Spominska kartica"
              className="object-contain w-full h-full p-2"
              onError={(e) => console.error("Error loading image:", e)}
            />
          )}
          
          {!imageUrl && (
            <div className="text-lg text-center p-2 text-gray-500">
              Ni slike
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
