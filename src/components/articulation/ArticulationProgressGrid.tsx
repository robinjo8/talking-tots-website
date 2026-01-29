import { cn } from "@/lib/utils";

interface ArticulationProgressGridProps {
  letters: string[];
  completedWords: number[]; // 0-3 for each letter
  currentLetterIndex: number;
  compact?: boolean;
}

const ArticulationProgressGrid = ({
  letters,
  completedWords,
  currentLetterIndex,
  compact = false,
}: ArticulationProgressGridProps) => {
  // Split letters into two rows of 10
  const firstRow = letters.slice(0, 10);
  const secondRow = letters.slice(10, 20);

  const renderLetterBox = (letter: string, index: number) => {
    const completed = completedWords[index] || 0;
    const isCurrent = index === currentLetterIndex;
    const isCompleted = completed === 3;

    // Calculate gradient based on completed words (0-3)
    const getGradientStyle = () => {
      if (completed === 0) return {};
      if (completed === 1) {
        return {
          background: `linear-gradient(to top, hsl(142, 76%, 45%) 33.33%, white 33.33%)`,
        };
      }
      if (completed === 2) {
        return {
          background: `linear-gradient(to top, hsl(142, 76%, 45%) 66.66%, white 66.66%)`,
        };
      }
      return {
        background: `hsl(142, 76%, 45%)`,
      };
    };

    return (
      <div
        key={`${letter}-${index}`}
        className={cn(
          "relative rounded-md flex items-center justify-center font-bold transition-all duration-300 border-2",
          compact 
            ? "w-6 h-6 text-xs" 
            : "w-8 h-8 md:w-10 md:h-10 text-sm md:text-base",
          isCurrent
            ? "border-orange-500 shadow-lg shadow-orange-500/30 scale-110 z-10"
            : "border-gray-300",
          isCompleted ? "text-white" : "text-gray-700"
        )}
        style={getGradientStyle()}
      >
        <span className={cn(
          "relative z-10",
          completed >= 2 ? "text-white" : "text-gray-700"
        )}>
          {letter}
        </span>
      </div>
    );
  };

  return (
    <div className={cn(
      "flex flex-col items-center",
      compact ? "gap-0.5" : "gap-1.5"
    )}>
      {/* First row */}
      <div className={cn("flex", compact ? "gap-0.5" : "gap-1 md:gap-1.5")}>
        {firstRow.map((letter, index) => renderLetterBox(letter, index))}
      </div>
      {/* Second row */}
      <div className={cn("flex", compact ? "gap-0.5" : "gap-1 md:gap-1.5")}>
        {secondRow.map((letter, index) => renderLetterBox(letter, index + 10))}
      </div>
      
      {/* Legend - separate row, smaller text */}
      {!compact && (
        <div className="flex items-center justify-center gap-3 mt-1 text-[10px] text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 border border-gray-300 rounded-sm bg-white"></div>
            <span>Ni izgovorjeno</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: 'linear-gradient(to top, hsl(142, 76%, 45%) 50%, white 50%)' }}></div>
            <span>V teku</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm bg-green-500"></div>
            <span>Končano</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticulationProgressGrid;
