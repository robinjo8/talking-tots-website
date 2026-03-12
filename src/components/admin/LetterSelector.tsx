import React from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ALL_LETTERS = [
  'P', 'B', 'M', 'T', 'D', 'K', 'G', 'N', 'H', 'V',
  'J', 'F', 'L', 'S', 'Z', 'C', 'Š', 'Ž', 'Č', 'R'
];

export interface RecommendedLetter {
  letter: string;
  position: 'start' | 'middle-end' | 'initial-exercises';
}

interface LetterSelectorProps {
  selectedLetters: RecommendedLetter[];
  onLettersChange: (letters: RecommendedLetter[]) => void;
}

export function formatRecommendedLettersText(letters: RecommendedLetter[]): string {
  if (letters.length === 0) return '';
  
  const parts = letters.map(l => {
    const posText = l.position === 'start' ? 'na začetku besed' : l.position === 'initial-exercises' ? '(začetne vaje)' : 'na sredini/koncu besed';
    return `glas ${l.letter} ${posText}`;
  });
  
  if (parts.length === 1) return `Priporočamo igre in vaje za ${parts[0]}.`;
  
  const allButLast = parts.slice(0, -1);
  const last = parts[parts.length - 1];
  return `Priporočamo igre in vaje za ${allButLast.join(', ')} in za ${last}.`;
}

// Legacy support: convert string[] to RecommendedLetter[] for old reports
export function convertLegacyLetters(letters: string[] | RecommendedLetter[]): RecommendedLetter[] {
  if (letters.length === 0) return [];
  if (typeof letters[0] === 'string') {
    return (letters as string[]).map(l => ({ letter: l, position: 'start' as const }));
  }
  return letters as RecommendedLetter[];
}

// Legacy support: format text from string[] (used in old PDF generation)
export function formatRecommendedLettersTextLegacy(letters: string[]): string {
  if (letters.length === 0) return '';
  if (letters.length === 1) return `Priporočamo igre in vaje za glas ${letters[0]}.`;
  if (letters.length === 2) return `Priporočamo igre in vaje za glas ${letters[0]} in za glas ${letters[1]}.`;
  const allButLast = letters.slice(0, -1);
  const last = letters[letters.length - 1];
  const parts = allButLast.map(l => `glas ${l}`);
  return `Priporočamo igre in vaje za ${parts.join(', ')} in za glas ${last}.`;
}

export function LetterSelector({ selectedLetters, onLettersChange }: LetterSelectorProps) {
  const toggleLetter = (letter: string) => {
    const existing = selectedLetters.find(l => l.letter === letter);
    if (existing) {
      onLettersChange(selectedLetters.filter(l => l.letter !== letter));
    } else {
      // Add with default position 'start'
      onLettersChange([...selectedLetters, { letter, position: 'start' }]);
    }
  };

  const removeLetter = (letter: string) => {
    onLettersChange(selectedLetters.filter(l => l.letter !== letter));
  };

  const changePosition = (letter: string, position: 'start' | 'middle-end' | 'initial-exercises') => {
    onLettersChange(selectedLetters.map(l => 
      l.letter === letter ? { ...l, position } : l
    ));
  };

  return (
    <div className="space-y-3">
      <span className="text-sm font-medium text-foreground">Priporočamo igre in vaje za:</span>

      {selectedLetters.length > 0 && (
        <div className="space-y-2 pl-2">
          {selectedLetters.map(item => (
            <div key={item.letter} className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className="gap-1 cursor-pointer hover:bg-destructive/10 min-w-[2.5rem] justify-center"
                onClick={() => removeLetter(item.letter)}
              >
                {item.letter}
                <X className="h-3 w-3" />
              </Badge>
              <Select
                value={item.position}
                onValueChange={(val) => changePosition(item.letter, val as 'start' | 'middle-end' | 'initial-exercises')}
              >
                <SelectTrigger className={cn("h-7 text-xs px-2", item.letter === 'R' ? "w-[160px]" : "w-[140px]")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="start">Začetek</SelectItem>
                  <SelectItem value="middle-end">Sredina/konec</SelectItem>
                  {item.letter === 'R' && (
                    <SelectItem value="initial-exercises">Začetne vaje</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      )}

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-7 text-xs">
            + Dodaj glas
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" align="start">
          <div className="grid grid-cols-5 gap-2">
            {ALL_LETTERS.map(letter => (
              <label
                key={letter}
                className="flex items-center gap-1.5 cursor-pointer text-sm"
              >
                <Checkbox
                  checked={selectedLetters.some(l => l.letter === letter)}
                  onCheckedChange={() => toggleLetter(letter)}
                />
                {letter}
              </label>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {selectedLetters.length > 0 && (
        <p className="text-sm font-medium text-foreground bg-muted/50 rounded-md px-3 py-2">
          {formatRecommendedLettersText(selectedLetters)}
        </p>
      )}
    </div>
  );
}
