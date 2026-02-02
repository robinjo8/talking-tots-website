import React, { useState, useEffect } from 'react';
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
import { useLogopedistChildren, LogopedistChild, UpdateChildInput } from '@/hooks/useLogopedistChildren';

const SPEECH_DIFFICULTIES_OPTIONS = [
  'Š', 'Ž', 'Č', 'C', 'S', 'Z', 'R', 'L', 'K', 'G', 'P', 'B', 'M', 'N', 'T', 'D'
];

interface EditChildModalProps {
  child: LogopedistChild;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditChildModal({ child, open, onOpenChange }: EditChildModalProps) {
  const { updateChild } = useLogopedistChildren();
  
  const [name, setName] = useState(child.name);
  const [age, setAge] = useState(child.age.toString());
  const [gender, setGender] = useState<'male' | 'female'>(child.gender || 'male');
  const [speechDifficulties, setSpeechDifficulties] = useState<string[]>(child.speech_difficulties || []);
  const [notes, setNotes] = useState(child.notes || '');
  const [externalId, setExternalId] = useState(child.external_id || '');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Posodobi stanje ob spremembi otroka
  useEffect(() => {
    setName(child.name);
    setAge(child.age.toString());
    setGender(child.gender || 'male');
    setSpeechDifficulties(child.speech_difficulties || []);
    setNotes(child.notes || '');
    setExternalId(child.external_id || '');
  }, [child]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !age) return;
    
    setIsSubmitting(true);
    
    try {
      const input: UpdateChildInput = {
        id: child.id,
        name: name.trim(),
        age: parseInt(age, 10),
        gender,
        speech_difficulties: speechDifficulties.length > 0 ? speechDifficulties : undefined,
        notes: notes.trim() || undefined,
        external_id: externalId.trim() || undefined,
      };
      
      await updateChild.mutateAsync(input);
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
          <DialogTitle>Uredi otroka</DialogTitle>
          <DialogDescription>
            Posodobite podatke o otroku.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Ime */}
          <div className="space-y-2">
            <Label htmlFor="edit-name">Ime otroka *</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Npr. Žan Novak"
              required
            />
          </div>

          {/* Starost */}
          <div className="space-y-2">
            <Label htmlFor="edit-age">Starost *</Label>
            <Input
              id="edit-age"
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
                <RadioGroupItem value="male" id="edit-male" />
                <Label htmlFor="edit-male" className="font-normal cursor-pointer">Deček</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="edit-female" />
                <Label htmlFor="edit-female" className="font-normal cursor-pointer">Deklica</Label>
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
            <Label htmlFor="edit-notes">Notranji zapiski (opcijsko)</Label>
            <Textarea
              id="edit-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Npr. diagnoza, frekvenca obiskov, posebnosti..."
              rows={3}
            />
          </div>

          {/* Zunanji ID */}
          <div className="space-y-2">
            <Label htmlFor="edit-externalId">Zunanji ID (opcijsko)</Label>
            <Input
              id="edit-externalId"
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
              {isSubmitting ? 'Shranjevanje...' : 'Shrani spremembe'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
