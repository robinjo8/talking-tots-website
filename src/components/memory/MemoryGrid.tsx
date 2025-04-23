
import { Card } from "@/components/ui/card";
import { MemoryCard } from "./MemoryCard";

export function MemoryGrid() {
  const cards = Array.from({ length: 20 }, (_, i) => i);

  return (
    <Card className="w-full p-4 bg-white/50 backdrop-blur-sm border-dragon-green/20">
      <div className="grid grid-cols-5 gap-3 aspect-[5/4]">
        {cards.map((index) => (
          <MemoryCard key={index} index={index} />
        ))}
      </div>
    </Card>
  );
}
