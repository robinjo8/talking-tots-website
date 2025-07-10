import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { PuzzleConfirmationDialog } from "./PuzzleConfirmationDialog";

interface PuzzleCompletionButtonProps {
  isActive: boolean;
  onComplete: () => void;
  className?: string;
}

export function PuzzleCompletionButton({ isActive, onComplete, className }: PuzzleCompletionButtonProps) {
  const buttonText = isActive ? "Sestavil sem sestavljanko!" : "Sestavljanka je že rešena";

  return (
    <PuzzleConfirmationDialog onConfirm={onComplete}>
      <Button 
        disabled={!isActive}
        size="lg"
        className={`${
          isActive 
            ? 'bg-dragon-green hover:bg-dragon-green/90 text-white' 
            : 'bg-gray-400 text-gray-600 cursor-not-allowed'
        } ${className}`}
      >
        <CheckCircle className="w-5 h-5 mr-2" />
        {buttonText}
      </Button>
    </PuzzleConfirmationDialog>
  );
}