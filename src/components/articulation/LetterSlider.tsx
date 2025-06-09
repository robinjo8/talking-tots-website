
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
    <div className="relative w-full max-w-2xl mx-auto mb-8">
      {/* Main slider container */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-app-blue/10 to-app-purple/10 border-2 border-app-blue/20 shadow-lg">
        <div className="relative h-32 flex items-center justify-center">
          {/* Previous button */}
          <Button
            onClick={handlePrevious}
            variant="ghost"
            size="icon"
            className="absolute left-4 z-10 h-12 w-12 rounded-full bg-white/80 hover:bg-white shadow-md border-2 border-app-blue/20 hover:border-app-blue/40 transition-all duration-200"
          >
            <ChevronLeft className="h-6 w-6 text-app-blue" />
          </Button>

          {/* Letter display */}
          <div className="flex items-center justify-center w-full">
            <div
              key={currentIndex}
              className="animate-scale-in flex items-center justify-center"
            >
              <span className="text-6xl md:text-7xl font-bold text-app-blue drop-shadow-sm font-rounded">
                {letters[currentIndex]?.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Next button */}
          <Button
            onClick={handleNext}
            variant="ghost"
            size="icon"
            className="absolute right-4 z-10 h-12 w-12 rounded-full bg-white/80 hover:bg-white shadow-md border-2 border-app-blue/20 hover:border-app-blue/40 transition-all duration-200"
          >
            <ChevronRight className="h-6 w-6 text-app-blue" />
          </Button>
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
          {letters.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                onLetterChange(letters[index]);
              }}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all duration-300",
                index === currentIndex
                  ? "bg-app-blue scale-125 shadow-sm"
                  : "bg-app-blue/30 hover:bg-app-blue/50"
              )}
              aria-label={`Pojdi na črko ${letters[index]}`}
            />
          ))}
        </div>
      </div>

      {/* Letter navigation info */}
      <div className="text-center mt-4">
        <p className="text-sm text-muted-foreground">
          Črka {currentIndex + 1} od {letters.length}
        </p>
      </div>
    </div>
  );
};

export default LetterSlider;
