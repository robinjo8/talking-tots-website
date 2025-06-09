
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface LetterSliderProps {
  letters: string[];
  currentLetter: string;
  onLetterChange: (letter: string) => void;
}

const LetterSlider = ({ letters, currentLetter, onLetterChange }: LetterSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Update index when currentLetter changes externally
  useEffect(() => {
    const index = letters.indexOf(currentLetter);
    if (index !== -1) {
      setCurrentIndex(index);
    }
  }, [currentLetter, letters]);

  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : letters.length - 1;
    setCurrentIndex(newIndex);
    onLetterChange(letters[newIndex]);
  };

  const handleNext = () => {
    const newIndex = currentIndex < letters.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    onLetterChange(letters[newIndex]);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-6">
      {/* Main slider container */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-app-blue/10 to-app-purple/10 border-2 border-app-blue/20 shadow-lg">
        <div className="relative h-24 md:h-32 flex items-center justify-center">
          {/* Previous button */}
          <Button
            onClick={handlePrevious}
            variant="ghost"
            size="icon"
            className="absolute left-2 md:left-4 z-10 h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/80 hover:bg-white shadow-md border-2 border-app-blue/20 hover:border-app-blue/40 transition-all duration-200"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6 text-app-blue" />
          </Button>

          {/* Letter display */}
          <div className="flex items-center justify-center w-full">
            <div
              key={currentIndex}
              className="animate-scale-in flex items-center justify-center"
            >
              <span className="text-4xl md:text-6xl lg:text-7xl font-bold text-app-blue drop-shadow-sm font-rounded">
                {letters[currentIndex]?.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Next button */}
          <Button
            onClick={handleNext}
            variant="ghost"
            size="icon"
            className="absolute right-2 md:right-4 z-10 h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/80 hover:bg-white shadow-md border-2 border-app-blue/20 hover:border-app-blue/40 transition-all duration-200"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-app-blue" />
          </Button>
        </div>

        {/* Progress indicator dots */}
        <div className="absolute bottom-2 md:bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5 md:gap-2">
          {letters.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                onLetterChange(letters[index]);
              }}
              className={cn(
                "w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300",
                index === currentIndex
                  ? "bg-app-blue scale-125 shadow-sm"
                  : "bg-app-blue/30 hover:bg-app-blue/50"
              )}
              aria-label={`Pojdi na črko ${letters[index]}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LetterSlider;
