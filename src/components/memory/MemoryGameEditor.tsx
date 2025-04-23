
import React from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image, FileAudio, Upload } from "lucide-react";
import type { MemoryCard } from '@/data/memoryGameData';

interface MemoryGameEditorProps {
  cards: MemoryCard[];
  onUpdateCard: (index: number, updates: Partial<MemoryCard>) => void;
}

export function MemoryGameEditor({ cards, onUpdateCard }: MemoryGameEditorProps) {
  const handleFileUpload = async (file: File, type: 'image' | 'audio', index: number) => {
    // For now, we'll just use URL.createObjectURL for preview
    // In production, this should upload to Supabase storage
    const url = URL.createObjectURL(file);
    onUpdateCard(index, type === 'image' ? { image: url } : { audioUrl: url });
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {Array.from({ length: 20 }).map((_, index) => {
        const card = cards[index] || { id: index, word: '', type: 'image' };
        
        return (
          <Card key={index} className="p-4 space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                Slika
              </Label>
              <div className="relative">
                {card.image && (
                  <img 
                    src={card.image} 
                    alt={card.word || 'Preview'} 
                    className="w-full h-32 object-cover rounded-md mb-2"
                  />
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'image', index)}
                  className="w-full"
                />
              </div>
              <Input
                type="text"
                placeholder="URL slike"
                value={card.image || ''}
                onChange={(e) => onUpdateCard(index, { image: e.target.value })}
                className="mt-1"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <FileAudio className="h-4 w-4" />
                Zvok
              </Label>
              <Input
                type="file"
                accept="audio/*"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'audio', index)}
                className="w-full"
              />
              <Input
                type="text"
                placeholder="URL zvoka"
                value={card.audioUrl || ''}
                onChange={(e) => onUpdateCard(index, { audioUrl: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Beseda</Label>
              <Input
                type="text"
                placeholder="Vnesi besedo"
                value={card.word || ''}
                onChange={(e) => onUpdateCard(index, { word: e.target.value })}
              />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
