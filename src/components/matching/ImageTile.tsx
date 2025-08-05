import { MatchingGameImage } from '@/data/matchingGameData';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface ImageTileProps {
  image: MatchingGameImage;
  isSelected: boolean;
  isMatched: boolean;
  onClick: () => void;
  className?: string;
  'data-image-id'?: string;
  'data-column'?: string | number;
  'data-index'?: string | number;
}

export function ImageTile({ image, isSelected, isMatched, onClick, className, ...dataProps }: ImageTileProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative rounded-lg border-2 cursor-pointer transition-all duration-200 bg-background",
        "hover:scale-105 hover:shadow-md",
        isSelected && "border-app-purple shadow-lg scale-105",
        isMatched && "border-dragon-green bg-dragon-green/10",
        !isSelected && !isMatched && "border-gray-300 hover:border-app-purple/50",
        className
      )}
      {...dataProps}
    >
      <img
        src={image.url}
        alt={image.word}
        className="w-full h-full object-contain p-1 rounded-lg"
        onError={(e) => {
          console.error(`Failed to load image: ${image.url}`);
          e.currentTarget.style.display = 'none';
        }}
      />
      
      {isMatched && (
        <div className="absolute inset-0 bg-dragon-green/20 rounded-lg flex items-center justify-center">
          <Check className="h-6 w-6 text-dragon-green" />
        </div>
      )}
      
      {isSelected && !isMatched && (
        <div className="absolute inset-0 bg-app-purple/20 rounded-lg border-2 border-app-purple" />
      )}
    </div>
  );
}