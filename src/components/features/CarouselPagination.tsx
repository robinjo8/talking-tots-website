
import { cn } from "@/lib/utils";

interface CarouselPaginationProps {
  count: number;
  current: number;
  onDotClick: (index: number) => void;
}

export const CarouselPagination = ({ count, current, onDotClick }: CarouselPaginationProps) => {
  return (
    <div className="flex justify-center gap-4 mt-8">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          className={cn(
            "relative w-6 h-6 flex items-center justify-center transition-all duration-300",
            "before:content-[''] before:absolute before:w-2.5 before:h-2.5 before:rounded-full before:transition-all before:duration-300",
            i === current 
              ? "before:bg-white before:scale-125 before:shadow-sm" 
              : "before:bg-white/40 hover:before:bg-white/60"
          )}
          onClick={() => onDotClick(i)}
          aria-label={`Pojdi na predstavitev ${i + 1}`}
        />
      ))}
    </div>
  );
};
