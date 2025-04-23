
import { Card } from "@/components/ui/card";
import { EditableMemoryCard } from "./EditableMemoryCard";

interface MemoryCardData {
  id: string;
  word: string;
  imageUrl: string | null;
  audioUrl: string | null;
}

const INITIAL_CARDS: MemoryCardData[] = Array(20).fill(null).map((_, index) => ({
  id: `card-${index + 1}`,
  word: "",
  imageUrl: null,
  audioUrl: null,
}));

export function MemoryCardGrid() {
  const handleCardUpdate = (cardId: string, data: Omit<MemoryCardData, "id">) => {
    console.log("Updating card:", cardId, data);
    // Here you would typically update the data in Supabase
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 pb-20">
      <Card className="p-6 bg-dragon-green/5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {INITIAL_CARDS.map((card) => (
            <EditableMemoryCard
              key={card.id}
              word={card.word}
              imageUrl={card.imageUrl}
              audioUrl={card.audioUrl}
              onUpdate={(data) => handleCardUpdate(card.id, data)}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
