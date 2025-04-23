
import { useState } from 'react';
import { MemoryCardEditor } from './MemoryCardEditor';
import type { MemoryCard } from '@/data/memoryGameData';

interface MemoryGameEditorProps {
  cards: MemoryCard[];
  onUpdateCard: (index: number, updatedCard: MemoryCard) => void;
}

export function MemoryGameEditor({ cards, onUpdateCard }: MemoryGameEditorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {cards.map((card, index) => (
        <MemoryCardEditor
          key={card.id}
          card={card}
          onUpdate={(updatedCard) => onUpdateCard(index, updatedCard)}
        />
      ))}
    </div>
  );
}
