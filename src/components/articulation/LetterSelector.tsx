
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LetterSelectorProps {
  selectedLetter: string | null;
  onLetterSelect: (letter: string) => void;
}

const LetterSelector = ({ selectedLetter, onLetterSelect }: LetterSelectorProps) => {
  const problematicLetters = ["R", "L", "S", "Š", "Č", "Ž", "C", "Z"];
  
  return (
    <div className="bg-gray-50 p-4 mb-6 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Izberi glas za vajo:</h2>
      <div className="flex flex-wrap gap-3 justify-center">
        {problematicLetters.map((letter) => (
          <Button
            key={letter}
            onClick={() => onLetterSelect(letter)}
            variant={selectedLetter === letter ? "default" : "outline"}
            className={cn(
              "text-lg font-bold min-w-14 h-14",
              selectedLetter === letter && "bg-app-blue hover:bg-app-blue/90"
            )}
          >
            {letter}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default LetterSelector;
