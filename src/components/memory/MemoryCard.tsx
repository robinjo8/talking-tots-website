
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import { useEffect, useRef } from "react";

interface MemoryCardProps {
  index: number;
  imageUrl?: string | null;
  audioUrl?: string | null;
  word?: string | null;
  flipped: boolean;
  matched: boolean;
  onClick: () => void;
}

export function MemoryCard({ 
  index, 
  imageUrl, 
  audioUrl, 
  word,
  flipped,
  matched,
  onClick 
}: MemoryCardProps) {
  const { audioRef, playAudio } = useAudioPlayback();
  const hasPlayedAudio = useRef(false);

  // Play audio when card is flipped
  useEffect(() => {
    if (flipped && audioUrl && !hasPlayedAudio.current) {
      playAudio(audioUrl);
      hasPlayedAudio.current = true;
    }
    
    if (!flipped) {
      hasPlayedAudio.current = false;
    }
  }, [flipped, audioUrl, playAudio]);

  return (
    <div className="flip-card" onClick={onClick}>
      <div className={cn("flip-card-inner", flipped && "flipped")}>
        {/* Front of card (question mark) */}
        <Card className="flip-card-front border-2 border-dragon-green/20">
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl font-bold text-dragon-green">?</span>
          </div>
        </Card>
        
        {/* Back of card (image or word) */}
        <Card className={cn("flip-card-back border-2", matched ? "border-app-green" : "border-dragon-green/20", matched && "matched")}>
          <audio ref={audioRef} className="hidden" />
          <div className="w-full h-full flex flex-col items-center justify-center p-1">
            {imageUrl ? (
              <div className="relative w-full h-full flex flex-col items-center">
                <img 
                  src={imageUrl} 
                  alt={word || ""} 
                  className="w-full h-[85%] object-contain" 
                />
                {word && (
                  <div className="mt-auto py-1 px-2 text-center w-full">
                    <p className="font-medium text-dragon-green text-sm md:text-base truncate">{word}</p>
                  </div>
                )}
              </div>
            ) : word ? (
              <p className="word-text">{word}</p>
            ) : (
              <span className="text-xl text-gray-400">Ni slike</span>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
