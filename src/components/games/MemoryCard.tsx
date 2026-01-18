
import { useEffect } from "react";
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

  const handleCardClick = () => {
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
    <div className="flip-card w-full" onClick={handleCardClick}>
      <div className={cn("flip-card-inner", flipped || matched ? "flipped" : "")}>
        {/* Front side - Green with question mark */}
        <div className="flip-card-front">
          <div className="flex items-center justify-center w-full h-full">
            <span className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg select-none">
              ?
            </span>
          </div>
        </div>

        {/* Back side - White with image */}
        <div className={cn("flip-card-back", matched && "matched")}>
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Spominska kartica"
              className="object-contain w-full h-full p-3"
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
