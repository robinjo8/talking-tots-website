
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { MemoryCard } from '@/data/memoryGameData';

interface MemoryCardEditorProps {
  card: MemoryCard;
  onUpdate: (updatedCard: MemoryCard) => void;
}

export function MemoryCardEditor({ card, onUpdate }: MemoryCardEditorProps) {
  const [imageUrl, setImageUrl] = useState(card.image || '');
  const [audioUrl, setAudioUrl] = useState(card.audioUrl || '');
  
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setImageUrl(newUrl);
    onUpdate({ ...card, image: newUrl });
  };

  const handleAudioUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setAudioUrl(newUrl);
    onUpdate({ ...card, audioUrl: newUrl });
  };

  const handleWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...card, word: e.target.value });
  };

  return (
    <Card className="w-full h-full p-4 space-y-4">
      <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-gray-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={card.word}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Predogled slike
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor={`word-${card.id}`}>Beseda</Label>
          <Input
            id={`word-${card.id}`}
            value={card.word}
            onChange={handleWordChange}
            placeholder="Vnesi besedo"
          />
        </div>

        <div>
          <Label htmlFor={`image-${card.id}`}>URL slike</Label>
          <Input
            id={`image-${card.id}`}
            value={imageUrl}
            onChange={handleImageUrlChange}
            placeholder="Vnesi URL slike"
          />
        </div>

        <div>
          <Label htmlFor={`audio-${card.id}`}>URL zvoka</Label>
          <Input
            id={`audio-${card.id}`}
            value={audioUrl}
            onChange={handleAudioUrlChange}
            placeholder="Vnesi URL zvoka"
          />
        </div>
      </div>
    </Card>
  );
}
