
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";

interface MemoryCardProps {
  word: string;
  type: 'image' | 'text';
  image?: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
}

export function MemoryCard({ word, type, image, isFlipped, isMatched, onClick }: MemoryCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Reset error state when a new image is provided
    if (image) {
      setImageError(false);
      setImageLoaded(false);
    }
  }, [image]);

  const handleImageError = () => {
    console.error(`Failed to load image for word: ${word}, URL: ${image}`);
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log(`Successfully loaded image for word: ${word}, URL: ${image}`);
    setImageLoaded(true);
  };

  return (
    <Card
      className={cn(
        "w-full aspect-[4/5] cursor-pointer perspective-1000 transition-transform duration-500 transform-style-preserve-3d",
        (isFlipped || isMatched) && "rotate-y-180"
      )}
      onClick={onClick}
    >
      <div className="w-full h-full relative">
        {/* Front face (hidden when flipped) */}
        <div className={cn(
          "absolute w-full h-full backface-hidden bg-gradient-to-br from-dragon-green/20 to-app-blue/20 rounded-lg flex items-center justify-center",
          (isFlipped || isMatched) && "invisible"
        )}>
          <span className="text-4xl font-bold text-dragon-green">?</span>
        </div>

        {/* Back face (visible when flipped) */}
        <div className={cn(
          "absolute w-full h-full backface-hidden rounded-lg flex items-center justify-center p-4 rotate-y-180",
          isMatched ? "bg-dragon-green/20" : "bg-white"
        )}>
          {type === 'image' && image && !imageError ? (
            <>
              <img 
                src={image} 
                alt={word}
                className={cn(
                  "w-full h-full object-contain rounded",
                  !imageLoaded && "opacity-0"
                )}
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">Loading...</span>
                </div>
              )}
            </>
          ) : (
            <span className="text-xl md:text-2xl font-bold text-center break-words text-dragon-green">
              {type === 'image' && imageError ? '❌' : word}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
