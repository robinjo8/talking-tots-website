
import { SPEECH_DIFFICULTIES } from "@/models/SpeechDifficulties";

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
        <div key={difficulty.id} className="flex items-start gap-2">
          <span className="text-xl leading-none">{difficulty.icon}</span>
          <div>
            <p className="font-medium text-sm">{difficulty.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
