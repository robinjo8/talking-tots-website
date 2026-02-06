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

const ALL_LETTERS = [
  'P', 'B', 'M', 'T', 'D', 'K', 'G', 'N', 'H', 'V',
  'J', 'F', 'L', 'S', 'Z', 'C', 'Š', 'Ž', 'Č', 'R'
];

interface LetterSelectorProps {
  selectedLetters: string[];
  onLettersChange: (letters: string[]) => void;
}

export function formatRecommendedLettersText(letters: string[]): string {
  if (letters.length === 0) return '';
  if (letters.length === 1) return `Priporočamo igre in vaje za črko ${letters[0]}.`;
  if (letters.length === 2) return `Priporočamo igre in vaje za črko ${letters[0]} in za črko ${letters[1]}.`;
  
  // 3+ letters: "za črko R, črko K in za črko L."
  const allButLast = letters.slice(0, -1);
  const last = letters[letters.length - 1];
  const parts = allButLast.map((l, i) => i === 0 ? `črko ${l}` : `črko ${l}`);
  return `Priporočamo igre in vaje za ${parts.join(', ')} in za črko ${last}.`;
}

export function LetterSelector({ selectedLetters, onLettersChange }: LetterSelectorProps) {
  const toggleLetter = (letter: string) => {
    if (selectedLetters.includes(letter)) {
      onLettersChange(selectedLetters.filter(l => l !== letter));
    } else {
      onLettersChange([...selectedLetters, letter]);
    }
  };

  const removeLetter = (letter: string) => {
    onLettersChange(selectedLetters.filter(l => l !== letter));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground whitespace-nowrap">Priporočamo igre in vaje za</span>
        
        {selectedLetters.map(letter => (
          <Badge 
            key={letter} 
            variant="secondary" 
            className="gap-1 cursor-pointer hover:bg-destructive/10"
            onClick={() => removeLetter(letter)}
          >
            {letter}
            <X className="h-3 w-3" />
          </Badge>
        ))}

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              + Dodaj črko
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
                    checked={selectedLetters.includes(letter)}
                    onCheckedChange={() => toggleLetter(letter)}
                  />
                  {letter}
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {selectedLetters.length > 0 && (
        <p className="text-sm font-medium text-foreground bg-muted/50 rounded-md px-3 py-2">
          {formatRecommendedLettersText(selectedLetters)}
        </p>
      )}
    </div>
  );
}
