
import { cn } from "@/lib/utils";

interface CarouselPaginationProps {
  count: number;
  current: number;
  onDotClick: (index: number) => void;
}

export const CarouselPagination = ({ count, current, onDotClick }: CarouselPaginationProps) => {
  return (
    <div className="flex justify-center gap-2 mt-8">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          className="w-6 h-6 rounded-full flex items-center justify-center p-0 bg-transparent transition-all duration-300"
          onClick={() => onDotClick(i)}
          aria-label={`Pojdi na predstavitev ${i + 1}`}
        >
          <span className={cn(
            "rounded-full transition-all duration-300",
            i === current 
              ? "w-3 h-3 bg-white shadow-sm" 
              : "w-2.5 h-2.5 bg-white/40"
          )} />
        </button>
      ))}
    </div>
  );
};
