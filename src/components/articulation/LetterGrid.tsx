
import { cn } from "@/lib/utils";

interface LetterGridProps {
  letters: string[];
  currentLetter: string;
}

const LetterGrid = ({ letters, currentLetter }: LetterGridProps) => {
  // For desktop: Split into 2 rows (10, 10)
  // For mobile: Split into 3 rows (7, 7, 6)
  const firstRow = letters.slice(0, 7);
  const secondRow = letters.slice(7, 14);
  const thirdRow = letters.slice(14);
  
  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
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
      <div className="flex flex-wrap justify-center gap-2 mb-2">
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
      
      {/* Third row (always visible on mobile, hidden on desktop) */}
      <div className="flex flex-wrap justify-center gap-2">
        {thirdRow.map((letter) => (
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
