
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
          className={cn(
            "w-2.5 h-2.5 rounded-full transition-all duration-300",
            i === current 
              ? "bg-white scale-125 shadow-sm" 
              : "bg-white/40 hover:bg-white/60"
          )}
          onClick={() => onDotClick(i)}
          aria-label={`Pojdi na predstavitev ${i + 1}`}
        />
      ))}
    </div>
  );
};
