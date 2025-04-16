
import { SPEECH_DIFFICULTIES } from "@/models/SpeechDifficulties";
import { Badge } from "@/components/ui/badge";

interface SpeechDifficultiesListProps {
  difficultiesIds: string[];
  className?: string;
  showEmpty?: boolean;
  showDescription?: boolean;
}

export function SpeechDifficultiesList({ 
  difficultiesIds, 
  className = "",
  showEmpty = true,
  showDescription = false
}: SpeechDifficultiesListProps) {
  if (!difficultiesIds || difficultiesIds.length === 0) {
    return showEmpty ? (
      <p className="text-gray-500 text-sm italic">Ni zabeleženih govornih motenj</p>
    ) : null;
  }

  const selectedDifficulties = SPEECH_DIFFICULTIES.filter(difficulty => 
    difficultiesIds.includes(difficulty.id)
  );

  return (
    <div className={`space-y-2 ${className}`}>
      {selectedDifficulties.map(difficulty => (
        <div key={difficulty.id} className="mb-3">
          <Badge 
            variant="outline" 
            className="bg-app-purple/10 border-app-purple/30 text-app-purple py-1.5 px-3 mb-1"
          >
            <span className="text-lg mr-1.5">{difficulty.icon}</span>
            <span>{difficulty.title.split('–')[0].trim()}</span>
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
      ))}
    </div>
  );
}
