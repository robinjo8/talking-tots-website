
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MemoryCardProps {
  index: number;
}

export function MemoryCard({ index }: MemoryCardProps) {
  return (
    <Card
      className={cn(
        "w-full aspect-square cursor-pointer transition-all duration-300",
        "bg-gradient-to-br from-dragon-green/10 to-app-blue/10",
        "hover:scale-[1.02] active:scale-[0.98]",
        "border-2 border-dragon-green/20"
      )}
    >
      <div className="w-full h-full flex items-center justify-center p-6">
        <img 
          src="/placeholder.svg"
          alt="Memory card"
          className="w-full h-full object-contain"
        />
      </div>
    </Card>
  );
}
