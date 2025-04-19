
import { Progress } from "@/components/ui/progress";

interface PracticeProgressProps {
  currentWordIndex: number;
  totalWords: number;
  progress: number;
}

const PracticeProgress = ({ currentWordIndex, totalWords, progress }: PracticeProgressProps) => {
  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Napredek</span>
        <span className="text-sm font-medium">{currentWordIndex + 1}/{totalWords}</span>
      </div>
      <Progress value={progress} className="mb-6 h-3" />
    </>
  );
};

export default PracticeProgress;
