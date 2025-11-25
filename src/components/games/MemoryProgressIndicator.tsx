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
            "w-3 h-3 rounded-full transition-all duration-300",
            index < matchedPairs
              ? "bg-dragon-green scale-110 shadow-md"
              : "bg-gray-300/50 scale-100"
          )}
        />
      ))}
    </div>
  );
}
