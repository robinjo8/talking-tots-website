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
              ? "bg-gradient-to-br from-dragon-green to-app-teal scale-125 shadow-lg shadow-dragon-green/50 animate-scale-in"
              : "bg-gray-300/40 scale-100"
          )}
        />
      ))}
    </div>
  );
}

