import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Loader2, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { artikulacijaConfigs, type WordData, type BingoWordData } from '@/data/artikulacijaVajeConfig';
import { articulationData } from '@/data/articulationTestData';

interface AllWord {
  word: string;
  image: string;
  audio: string | null;
  letter: string;
  source: string;
}

function getAllAvailableWords(): AllWord[] {
  const words: AllWord[] = [];
  const seen = new Set<string>();

  // From articulationTestData (60 words used in standard test)
  for (const group of articulationData) {
    for (const w of group.words) {
      const key = w.text.toUpperCase();
      if (!seen.has(key)) {
        seen.add(key);
        words.push({
          word: w.text,
          image: w.image,
          audio: w.audio || null,
          letter: group.letter,
          source: 'test',
        });
      }
    }
  }

  // From artikulacijaVajeConfig (wheel + bingo games)
  for (const [, config] of Object.entries(artikulacijaConfigs)) {
    for (const w of config.wordsData) {
      const key = w.word.toUpperCase();
      if (!seen.has(key)) {
        seen.add(key);
        words.push({
          word: w.word,
          image: w.image,
          audio: w.audio || null,
          letter: config.letter,
          source: config.gameType,
        });
      }
    }
  }

  return words.sort((a, b) => a.letter.localeCompare(b.letter) || a.word.localeCompare(b.word));
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  childId: string;
  logopedistProfileId: string;
  onAssigned?: () => void;
}

export function AdditionalTestAssignDialog({ open, onOpenChange, childId, logopedistProfileId, onAssigned }: Props) {
  const [search, setSearch] = useState('');
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedLetterFilter, setSelectedLetterFilter] = useState<string | null>(null);

  const allWords = useMemo(() => getAllAvailableWords(), []);

  const letters = useMemo(() => {
    const set = new Set(allWords.map(w => w.letter));
    return Array.from(set).sort();
  }, [allWords]);

  const filteredWords = useMemo(() => {
    let filtered = allWords;
    if (selectedLetterFilter) {
      filtered = filtered.filter(w => w.letter === selectedLetterFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(w => w.word.toLowerCase().includes(q));
    }
    return filtered;
  }, [allWords, search, selectedLetterFilter]);

  const toggleWord = (wordKey: string) => {
    setSelectedWords(prev => {
      const next = new Set(prev);
      if (next.has(wordKey)) {
        next.delete(wordKey);
      } else {
        next.add(wordKey);
      }
      return next;
    });
  };

  const handleAssign = async () => {
    if (selectedWords.size === 0) {
      toast.error('Izberite vsaj eno besedo');
      return;
    }

    setIsAssigning(true);

    try {
      // Create assignment
      const { data: assignment, error: assignError } = await supabase
        .from('additional_test_assignments')
        .insert({
          child_id: childId,
          assigned_by: logopedistProfileId,
          status: 'assigned',
        })
        .select('id')
        .single();

      if (assignError || !assignment) {
        console.error('Error creating assignment:', assignError);
        toast.error('Napaka pri ustvarjanju dodelitve');
        setIsAssigning(false);
        return;
      }

      // Insert words
      const wordsToInsert = Array.from(selectedWords).map((wordKey, index) => {
        const word = allWords.find(w => `${w.letter}:${w.word}` === wordKey);
        if (!word) return null;
        return {
          assignment_id: assignment.id,
          word: word.word,
          image: word.image,
          audio: word.audio,
          letter: word.letter,
          sort_order: index,
        };
      }).filter(Boolean);

      const { error: wordsError } = await supabase
        .from('additional_test_words')
        .insert(wordsToInsert as any[]);

      if (wordsError) {
        console.error('Error inserting words:', wordsError);
        toast.error('Napaka pri shranjevanju besed');
        setIsAssigning(false);
        return;
      }

      toast.success(`Dodatno preverjanje dodeljeno (${selectedWords.size} besed)`);
      setSelectedWords(new Set());
      setSearch('');
      setSelectedLetterFilter(null);
      onOpenChange(false);
      onAssigned?.();

    } catch (err) {
      console.error('Error assigning additional test:', err);
      toast.error('Napaka pri dodelitvi');
    } finally {
      setIsAssigning(false);
    }
  };

  const getImageUrl = (imagePath: string) => {
    const { data } = supabase.storage.from('slike').getPublicUrl(imagePath);
    return data?.publicUrl || '';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Dodeli dodatno preverjanje
          </DialogTitle>
          <DialogDescription>
            Izberite besede za dodatno preverjanje izgovorjave. Otrok bo te besede prejel v posebnem testu.
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Poišči besedo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Letter filter chips */}
        <div className="flex flex-wrap gap-1.5">
          <Badge
            variant={selectedLetterFilter === null ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedLetterFilter(null)}
          >
            Vse
          </Badge>
          {letters.map(letter => (
            <Badge
              key={letter}
              variant={selectedLetterFilter === letter ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedLetterFilter(selectedLetterFilter === letter ? null : letter)}
            >
              {letter}
            </Badge>
          ))}
        </div>

        {/* Selected count + clear */}
        {selectedWords.size > 0 && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Izbrano: <span className="font-medium text-foreground">{selectedWords.size}</span> besed</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => setSelectedWords(new Set())}
            >
              Počisti
            </Button>
          </div>
        )}

        {/* Word list */}
        <ScrollArea className="flex-1 min-h-[200px] max-h-[40vh] border rounded-lg">
          <div className="p-2 space-y-1">
            {filteredWords.map((word) => {
              const wordKey = `${word.letter}:${word.word}`;
              const isSelected = selectedWords.has(wordKey);

              return (
                <label
                  key={wordKey}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'bg-primary/10' : 'hover:bg-muted/50'
                  }`}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleWord(wordKey)}
                  />
                  <img
                    src={getImageUrl(word.image)}
                    alt={word.word}
                    className="w-10 h-10 object-cover rounded"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-sm">{word.word}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {word.letter}
                  </Badge>
                </label>
              );
            })}
            {filteredWords.length === 0 && (
              <p className="text-center text-muted-foreground py-8 text-sm">
                Ni rezultatov
              </p>
            )}
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Prekliči
          </Button>
          <Button
            onClick={handleAssign}
            disabled={selectedWords.size === 0 || isAssigning}
          >
            {isAssigning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Dodeljujem...
              </>
            ) : (
              <>Dodeli uporabniku ({selectedWords.size})</>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
