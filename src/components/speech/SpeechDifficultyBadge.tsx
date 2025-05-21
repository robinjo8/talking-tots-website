
import { Badge } from "@/components/ui/badge";
import { SpeechDifficulty } from "@/models/SpeechDifficulties";

interface SpeechDifficultyBadgeProps {
  difficulty: SpeechDifficulty;
  showDescription?: boolean;
  className?: string;
}

export function SpeechDifficultyBadge({ 
  difficulty, 
  showDescription = false,
  className = ""
}: SpeechDifficultyBadgeProps) {
  // Extract just the first part of the title if it contains a dash
  const displayTitle = difficulty.title.split('–')[0].trim();

  return (
    <div className={className}>
      <Badge 
        variant="outline" 
        className="bg-app-purple/10 border-app-purple/30 text-app-purple py-1.5 px-3 mb-1"
      >
        <span className="text-lg mr-1.5">{difficulty.icon}</span>
        <span>{displayTitle}</span>
      </Badge>
      
      {showDescription && (
        <p className="text-sm text-gray-600 ml-1 mt-1">
          {difficulty.description || 
            (difficulty.title.includes('–') ? 
              difficulty.title.split('–')[1].trim() : 
              "")}
        </p>
      )}
    </div>
  );
}
