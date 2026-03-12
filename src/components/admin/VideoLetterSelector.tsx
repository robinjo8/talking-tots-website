import React from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Only letters that have video navodila
const VIDEO_LETTERS = ['C', 'Č', 'K', 'L', 'R', 'S', 'Š', 'Z', 'Ž'];

interface VideoLetterSelectorProps {
  selectedLetters: string[];
  onLettersChange: (letters: string[]) => void;
  hidePreview?: boolean;
}

export function formatVideoLettersText(letters: string[]): string {
  if (letters.length === 0) return '';
  if (letters.length === 1) return `Priporočamo ogled video navodil za glas ${letters[0]}.`;
  if (letters.length === 2) return `Priporočamo ogled video navodil za glas ${letters[0]} in za glas ${letters[1]}.`;
  const allButLast = letters.slice(0, -1);
  const last = letters[letters.length - 1];
  const parts = allButLast.map((l) => `glas ${l}`);
  return `Priporočamo ogled video navodil za ${parts.join(', ')} in za glas ${last}.`;
}

export function VideoLetterSelector({ selectedLetters, onLettersChange, hidePreview = false }: VideoLetterSelectorProps) {
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

  // Available letters (not yet selected)
  const availableLetters = VIDEO_LETTERS.filter(
    letter => !selectedLetters.includes(letter)
  );

  return (
    <div className="space-y-2">
      <Select
        value=""
        onValueChange={(val) => toggleLetter(val)}
      >
        <SelectTrigger className="w-[200px] h-8 text-sm">
          <SelectValue placeholder="Izberi glas" />
        </SelectTrigger>
        <SelectContent>
          {availableLetters.map(letter => (
            <SelectItem key={letter} value={letter}>
              {letter}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedLetters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
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
        </div>
      )}

      {!hidePreview && selectedLetters.length > 0 && (
        <p className="text-sm font-medium text-foreground bg-muted/50 rounded-md px-3 py-2">
          {formatVideoLettersText(selectedLetters)}
        </p>
      )}
    </div>
  );
}
