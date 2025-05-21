
import { SPEECH_DIFFICULTIES } from "@/models/SpeechDifficulties";
import { SpeechDifficultyBadge } from "@/components/speech/SpeechDifficultyBadge";

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
  // Handle empty state
  if (!difficultiesIds || difficultiesIds.length === 0) {
    return showEmpty ? (
      <p className="text-gray-500 text-sm italic">Ni zabeleženih govornih motenj</p>
    ) : null;
  }

  // Find the selected difficulties from the difficulties model
  const selectedDifficulties = SPEECH_DIFFICULTIES.filter(difficulty => 
    difficultiesIds.includes(difficulty.id)
  );

  return (
    <div className={`space-y-2 ${className}`}>
      {selectedDifficulties.map(difficulty => (
        <div key={difficulty.id} className="mb-3">
          <SpeechDifficultyBadge 
            difficulty={difficulty} 
            showDescription={showDescription} 
          />
        </div>
      ))}
    </div>
  );
}
