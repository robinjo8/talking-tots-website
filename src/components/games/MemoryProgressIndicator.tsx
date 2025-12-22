import { cn } from "@/lib/utils";

interface MemoryProgressIndicatorProps {
  matchedPairs: number;
  totalPairs: number;
  className?: string;
}

export function MemoryProgressIndicator({ matchedPairs, totalPairs, className }: MemoryProgressIndicatorProps) {
  return (
    <div className={cn("flex items-center justify-center gap-2 py-4", className)}>
      {Array.from({ length: totalPairs }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "w-4 h-4 rounded-full transition-all duration-500 ease-out",
            index < matchedPairs
              ? "bg-gradient-to-br from-orange-400 to-orange-500 border-2 border-white scale-110 animate-scale-in"
              : "bg-white scale-100"
          )}
        />
      ))}
    </div>
  );
}

