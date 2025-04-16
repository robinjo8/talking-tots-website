
import { SPEECH_DIFFICULTIES } from "@/models/SpeechDifficulties";
import { Badge } from "@/components/ui/badge";

interface SpeechDifficultiesListProps {
  difficultiesIds: string[];
  className?: string;
  showEmpty?: boolean;
}

export function SpeechDifficultiesList({ 
  difficultiesIds, 
  className = "",
  showEmpty = true
}: SpeechDifficultiesListProps) {
  if (!difficultiesIds || difficultiesIds.length === 0) {
    return showEmpty ? (
      <p className="text-gray-500 text-sm italic">Ni zabeleženih govornih težav</p>
    ) : null;
  }

  const selectedDifficulties = SPEECH_DIFFICULTIES.filter(difficulty => 
    difficultiesIds.includes(difficulty.id)
  );

  return (
    <div className={`space-y-2 ${className}`}>
      {selectedDifficulties.map(difficulty => (
        <Badge 
          key={difficulty.id} 
          variant="outline" 
          className="bg-app-purple/10 border-app-purple/30 text-app-purple py-1.5 px-3"
        >
          <span className="text-lg mr-1.5">{difficulty.icon}</span>
          <span>{difficulty.title.split('–')[0].trim()}</span>
        </Badge>
      ))}
    </div>
  );
}
