import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useLogopedistChildren, CreateChildInput } from '@/hooks/useLogopedistChildren';

const SPEECH_DIFFICULTIES_OPTIONS = [
  'Š', 'Ž', 'Č', 'C', 'S', 'Z', 'R', 'L', 'K', 'G', 'P', 'B', 'M', 'N', 'T', 'D'
];

interface AddChildModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddChildModal({ open, onOpenChange }: AddChildModalProps) {
  const { createChild } = useLogopedistChildren();
  
  const [name, setName] = useState('');
  const [age, setAge] = useState('5');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [speechDifficulties, setSpeechDifficulties] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [externalId, setExternalId] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !age) return;
    
    setIsSubmitting(true);
    
    try {
      const input: CreateChildInput = {
        name: name.trim(),
        age: parseInt(age, 10),
        gender,
        speech_difficulties: speechDifficulties.length > 0 ? speechDifficulties : undefined,
        notes: notes.trim() || undefined,
        external_id: externalId.trim() || undefined,
      };
      
      await createChild.mutateAsync(input);
      
      // Počisti obrazec
      setName('');
      setAge('5');
      setGender('male');
      setSpeechDifficulties([]);
      setNotes('');
      setExternalId('');
      
      onOpenChange(false);
    } catch (error) {
      // Napaka je že prikazana v hook-u
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleDifficulty = (difficulty: string) => {
    setSpeechDifficulties(prev => 
      prev.includes(difficulty)
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Dodaj novega otroka</DialogTitle>
          <DialogDescription>
            Vnesite podatke o otroku, s katerim boste delali.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Ime */}
          <div className="space-y-2">
            <Label htmlFor="name">Ime otroka *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Npr. Žan Novak"
              required
            />
          </div>

          {/* Starost */}
          <div className="space-y-2">
            <Label htmlFor="age">Starost *</Label>
            <Input
              id="age"
              type="number"
              min="1"
              max="18"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>

          {/* Spol */}
          <div className="space-y-2">
            <Label>Spol</Label>
            <RadioGroup
              value={gender}
              onValueChange={(value) => setGender(value as 'male' | 'female')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male" className="font-normal cursor-pointer">Deček</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female" className="font-normal cursor-pointer">Deklica</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Govorni izzivi */}
          <div className="space-y-2">
            <Label>Govorni izzivi (opcijsko)</Label>
            <div className="flex flex-wrap gap-2">
              {SPEECH_DIFFICULTIES_OPTIONS.map((difficulty) => (
                <label
                  key={difficulty}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border cursor-pointer hover:bg-muted transition-colors"
                >
                  <Checkbox
                    checked={speechDifficulties.includes(difficulty)}
                    onCheckedChange={() => toggleDifficulty(difficulty)}
                  />
                  <span className="text-sm font-medium">{difficulty}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Zapiski */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notranji zapiski (opcijsko)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Npr. diagnoza, frekvenca obiskov, posebnosti..."
              rows={3}
            />
          </div>

          {/* Zunanji ID */}
          <div className="space-y-2">
            <Label htmlFor="externalId">Zunanji ID (opcijsko)</Label>
            <Input
              id="externalId"
              value={externalId}
              onChange={(e) => setExternalId(e.target.value)}
              placeholder="Npr. PAC-2024-042"
            />
            <p className="text-xs text-muted-foreground">
              ID iz vaše prakse za lažje sledenje
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Prekliči
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !name.trim() || !age}
              className="bg-dragon-green hover:bg-dragon-green/90"
            >
              {isSubmitting ? 'Shranjevanje...' : 'Shrani'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
