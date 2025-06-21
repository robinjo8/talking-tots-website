
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselNavigationProps {
  onPrevClick: () => void;
  onNextClick: () => void;
  isMobile: boolean;
}

export const CarouselNavigation = ({ onPrevClick, onNextClick, isMobile }: CarouselNavigationProps) => {
  if (isMobile) return null;

  return (
    <>
      <button 
        onClick={onPrevClick} 
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 h-12 w-12 bg-background shadow-lg hover:shadow-xl hover:bg-muted border border-border rounded-full flex items-center justify-center z-10 transition-all duration-300 hover:scale-105" 
        aria-label="Prejšnja funkcija"
      >
        <ChevronLeft className="h-5 w-5 text-foreground" />
      </button>
      <button 
        onClick={onNextClick} 
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 h-12 w-12 bg-background shadow-lg hover:shadow-xl hover:bg-muted border border-border rounded-full flex items-center justify-center z-10 transition-all duration-300 hover:scale-105" 
        aria-label="Naslednja funkcija"
      >
        <ChevronRight className="h-5 w-5 text-foreground" />
      </button>
    </>
  );
};
