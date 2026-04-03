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
import { Checkbox } from '@/components/ui/checkbox';

const ALL_LETTERS = ['C', 'Č', 'F', 'G', 'H', 'K', 'L', 'R', 'S', 'Š', 'V', 'Z', 'Ž'];

export interface RecommendedLetter {
  letter: string;
  positions: ('start' | 'middle-end' | 'initial-exercises')[];
}

interface LetterSelectorProps {
  selectedLetters: RecommendedLetter[];
  onLettersChange: (letters: RecommendedLetter[]) => void;
  hidePreview?: boolean;
}

export function formatRecommendedLettersText(letters: RecommendedLetter[]): string {
  if (letters.length === 0) return '';
  
  const parts = letters.map(l => {
    const posParts: string[] = [];
    if (l.positions.includes('start')) posParts.push('na začetku besed');
    if (l.positions.includes('middle-end')) posParts.push('na sredini/koncu besed');
    if (l.positions.includes('initial-exercises')) posParts.push('(začetne vaje)');
    const posText = posParts.join(' in ');
    return `glas ${l.letter} ${posText}`;
  });
  
  if (parts.length === 1) return `Priporočamo igre in vaje za ${parts[0]}.`;
  
  const allButLast = parts.slice(0, -1);
  const last = parts[parts.length - 1];
  return `Priporočamo igre in vaje za ${allButLast.join(', ')} in za ${last}.`;
}

// Legacy support: convert old format (string[] or {letter, position}) to new {letter, positions[]}
export function convertLegacyLetters(letters: string[] | { letter: string; position?: string; positions?: string[] }[]): RecommendedLetter[] {
  if (letters.length === 0) return [];
  if (typeof letters[0] === 'string') {
    return (letters as string[]).map(l => ({ letter: l, positions: ['start' as const] }));
  }
  const typed = letters as { letter: string; position?: string; positions?: string[] }[];
  return typed.map(l => {
    if (l.positions && Array.isArray(l.positions)) {
      return { letter: l.letter, positions: l.positions as RecommendedLetter['positions'] };
    }
    return { letter: l.letter, positions: [l.position as 'start' | 'middle-end' | 'initial-exercises' || 'start'] };
  });
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

export function LetterSelector({ selectedLetters, onLettersChange, hidePreview = false }: LetterSelectorProps) {
  const addLetter = (letter: string) => {
    if (!selectedLetters.some(l => l.letter === letter)) {
      onLettersChange([...selectedLetters, { letter, positions: ['start'] }]);
    }
  };

  const removeLetter = (letter: string) => {
    onLettersChange(selectedLetters.filter(l => l.letter !== letter));
  };

  const togglePosition = (letter: string, position: 'start' | 'middle-end' | 'initial-exercises') => {
    onLettersChange(selectedLetters.map(l => {
      if (l.letter !== letter) return l;
      const has = l.positions.includes(position);
      if (has) {
        // Don't allow removing the last position
        if (l.positions.length <= 1) return l;
        return { ...l, positions: l.positions.filter(p => p !== position) };
      }
      return { ...l, positions: [...l.positions, position] };
    }));
  };

  // Available letters (not yet selected)
  const availableLetters = ALL_LETTERS.filter(
    letter => !selectedLetters.some(l => l.letter === letter)
  );

  return (
    <div className="space-y-2">
      <Select
        value=""
        onValueChange={(val) => addLetter(val)}
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
        <div className="flex flex-col gap-2">
          {selectedLetters.map(item => (
            <div key={item.letter} className="flex items-center gap-2 flex-wrap">
              <Badge 
                variant="secondary" 
                className="gap-1 cursor-pointer hover:bg-destructive/10 min-w-[2.5rem] justify-center"
                onClick={() => removeLetter(item.letter)}
              >
                {item.letter}
                <X className="h-3 w-3" />
              </Badge>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                  <Checkbox
                    checked={item.positions.includes('start')}
                    onCheckedChange={() => togglePosition(item.letter, 'start')}
                  />
                  Začetek
                </label>
                <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                  <Checkbox
                    checked={item.positions.includes('middle-end')}
                    onCheckedChange={() => togglePosition(item.letter, 'middle-end')}
                  />
                  Sredina/konec
                </label>
                {item.letter === 'R' && (
                  <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <Checkbox
                      checked={item.positions.includes('initial-exercises')}
                      onCheckedChange={() => togglePosition(item.letter, 'initial-exercises')}
                    />
                    Začetne vaje
                  </label>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!hidePreview && selectedLetters.length > 0 && (
        <p className="text-sm font-medium text-foreground bg-muted/50 rounded-md px-3 py-2">
          {formatRecommendedLettersText(selectedLetters)}
        </p>
      )}
    </div>
  );
}
