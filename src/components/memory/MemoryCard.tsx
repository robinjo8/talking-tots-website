
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface MemoryCardProps {
  word: string;
  type: 'image' | 'text';
  image?: string;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
}

export function MemoryCard({ word, type, image, isFlipped, isMatched, onClick }: MemoryCardProps) {
  return (
    <Card
      className={cn(
        "w-full aspect-[4/5] cursor-pointer perspective-1000 transition-transform duration-500 transform-style-preserve-3d",
        (isFlipped || isMatched) && "rotate-y-180"
      )}
      onClick={onClick}
    >
      <div className="w-full h-full relative">
        {/* Front face (hidden) */}
        <div className={cn(
          "absolute w-full h-full backface-hidden bg-gradient-to-br from-dragon-green/20 to-app-blue/20 rounded-lg flex items-center justify-center",
          (isFlipped || isMatched) && "invisible"
        )}>
          <span className="text-4xl font-bold text-dragon-green">?</span>
        </div>

        {/* Back face (content) */}
        <div className={cn(
          "absolute w-full h-full backface-hidden rounded-lg flex items-center justify-center p-4 rotate-y-180",
          isMatched ? "bg-dragon-green/20" : "bg-white"
        )}>
          {type === 'image' && image ? (
            <img 
              src={image} 
              alt={word}
              className="w-full h-full object-contain rounded"
            />
          ) : (
            <span className="text-xl md:text-2xl font-bold text-center break-words text-dragon-green">
              {word}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
