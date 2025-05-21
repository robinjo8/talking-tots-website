
import { SPEECH_DIFFICULTIES } from "@/models/SpeechDifficulties";
import { SpeechDifficultyItem } from "./SpeechDifficultyItem";

interface SpeechDifficultyListProps {
  selectedDifficulties: string[];
  onToggleDifficulty: (difficultyId: string) => void;
}

export function SpeechDifficultyList({
  selectedDifficulties,
  onToggleDifficulty
}: SpeechDifficultyListProps) {
  return (
    <div className="space-y-4">
      {SPEECH_DIFFICULTIES.map((difficulty) => (
        <SpeechDifficultyItem
          key={difficulty.id}
          difficulty={difficulty}
          isSelected={selectedDifficulties.includes(difficulty.id)}
          onToggleSelect={onToggleDifficulty}
        />
      ))}
    </div>
  );
}
