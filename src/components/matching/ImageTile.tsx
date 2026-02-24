import { MatchingGameImage } from '@/data/matchingGameData';
import { cn } from '@/lib/utils';


interface ImageTileProps {
  image: MatchingGameImage;
  isSelected: boolean;
  isMatched: boolean;
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
  disableScaleEffects?: boolean;
  'data-image-id'?: string;
  'data-column'?: string | number;
  'data-index'?: string | number;
}

export function ImageTile({ image, isSelected, isMatched, onClick, className, style, disableScaleEffects = false, ...dataProps }: ImageTileProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-center border-2 rounded-xl cursor-pointer transition-all duration-200 overflow-hidden bg-white shadow-md",
        !disableScaleEffects && "hover:scale-105",
        className,
        isSelected && !disableScaleEffects && "border-app-purple shadow-lg scale-105 border-4",
        isSelected && disableScaleEffects && "border-app-purple shadow-lg border-4",
        isMatched && "border-dragon-green bg-dragon-green/10",
        !isSelected && !isMatched && "border-gray-300 hover:border-app-purple/50"
      )}
      style={style}
      {...dataProps}
    >
      <img
        src={image.url}
        alt={image.word}
        className="w-full h-full object-contain p-1"
        onError={(e) => {
          console.error(`Failed to load image: ${image.url}`);
          e.currentTarget.style.display = 'none';
        }}
      />
      
      {isMatched && (
        <div className="absolute inset-0 bg-dragon-green/20 rounded-xl" />
      )}
      
      {isSelected && !isMatched && (
        <div className="absolute inset-0 bg-app-purple/20 rounded-xl" />
      )}
    </div>
  );
}