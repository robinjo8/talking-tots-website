
import { cn } from "@/lib/utils";

interface LetterGridProps {
  letters: string[];
  currentLetter: string;
}

const LetterGrid = ({ letters, currentLetter }: LetterGridProps) => {
  // Calculate midpoint to split into two rows
  const midpoint = Math.ceil(letters.length / 2);
  const firstRow = letters.slice(0, midpoint);
  const secondRow = letters.slice(midpoint);
  
  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      {/* First row */}
      <div className="flex flex-wrap justify-center gap-2 mb-2">
        {firstRow.map((letter) => (
          <div
            key={letter}
            className={cn(
              "w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg font-bold text-lg transition-all",
              letter === currentLetter 
                ? "bg-app-purple text-white shadow-lg scale-110" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            {letter}
          </div>
        ))}
      </div>
      
      {/* Second row */}
      <div className="flex flex-wrap justify-center gap-2">
        {secondRow.map((letter) => (
          <div
            key={letter}
            className={cn(
              "w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg font-bold text-lg transition-all",
              letter === currentLetter 
                ? "bg-app-purple text-white shadow-lg scale-110" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            {letter}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LetterGrid;
