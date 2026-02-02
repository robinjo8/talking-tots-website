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
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { sl } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useLogopedistChildren, LogopedistChild, UpdateChildInput } from '@/hooks/useLogopedistChildren';
import { GenderSelector } from '@/components/GenderSelector';
import { AvatarSelector, avatarOptions } from '@/components/AvatarSelector';
import { calculateAge } from '@/utils/childUtils';

const SPEECH_DIFFICULTIES_OPTIONS = [
  'Š', 'Ž', 'Č', 'C', 'S', 'Z', 'R', 'L', 'K', 'G', 'P', 'B', 'M', 'N', 'T', 'D'
];

interface EditChildModalProps {
  child: LogopedistChild;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Helper za pretvorbo spola iz 'male'/'female' v 'M'/'Ž' in obratno
const genderToDisplay = (gender: 'male' | 'female' | null): string => {
  if (gender === 'male') return 'M';
  if (gender === 'female') return 'Ž';
  return 'N';
};

const displayToGender = (display: string): 'male' | 'female' | undefined => {
  if (display === 'M') return 'male';
  if (display === 'Ž') return 'female';
  return undefined;
};

// Helper za pretvorbo avatar_url v avatarId
const avatarUrlToId = (url: string | null): number => {
  if (!url) return 0;
  const avatar = avatarOptions.find(a => a.src === url);
  return avatar?.id || 0;
};

export function EditChildModal({ child, open, onOpenChange }: EditChildModalProps) {
  const { updateChild } = useLogopedistChildren();
  
  const [name, setName] = useState(child.name);
  const [birthDate, setBirthDate] = useState<Date | undefined>(
    child.birth_date ? new Date(child.birth_date) : undefined
  );
  const [gender, setGender] = useState<string>(genderToDisplay(child.gender));
  const [avatarId, setAvatarId] = useState<number>(avatarUrlToId(child.avatar_url));
  const [speechDifficulties, setSpeechDifficulties] = useState<string[]>(child.speech_difficulties || []);
  const [notes, setNotes] = useState(child.notes || '');
  const [externalId, setExternalId] = useState(child.external_id || '');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Posodobi stanje ob spremembi otroka
  useEffect(() => {
    setName(child.name);
    setBirthDate(child.birth_date ? new Date(child.birth_date) : undefined);
    setGender(genderToDisplay(child.gender));
    setAvatarId(avatarUrlToId(child.avatar_url));
    setSpeechDifficulties(child.speech_difficulties || []);
    setNotes(child.notes || '');
    setExternalId(child.external_id || '');
  }, [child]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Izračunaj starost iz datuma rojstva ali uporabi obstoječo
      const age = birthDate ? calculateAge(birthDate) : child.age;
      
      // Pridobi avatar URL iz avatarId
      const avatarUrl = avatarId > 0 ? avatarOptions[avatarId]?.src : null;
      
      const input: UpdateChildInput = {
        id: child.id,
        name: name.trim(),
        age,
        gender: displayToGender(gender),
        birth_date: birthDate ? birthDate.toISOString().split('T')[0] : undefined,
        avatar_url: avatarUrl || undefined,
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
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Uredi otroka</DialogTitle>
          <DialogDescription>
            Posodobite podatke o otroku.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
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

          {/* Datum rojstva */}
          <div className="space-y-2">
            <Label>Datum rojstva</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !birthDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {birthDate ? format(birthDate, "d. MMMM yyyy", { locale: sl }) : "Izberi datum"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={birthDate}
                  onSelect={setBirthDate}
                  disabled={(date) =>
                    date > new Date() || date < new Date("2000-01-01")
                  }
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                  locale={sl}
                />
              </PopoverContent>
            </Popover>
            {birthDate && (
              <p className="text-xs text-muted-foreground">
                Starost: {calculateAge(birthDate)} {calculateAge(birthDate) === 1 ? 'leto' : calculateAge(birthDate) < 5 ? 'leta' : 'let'}
              </p>
            )}
          </div>

          {/* Spol */}
          <GenderSelector
            selectedGender={gender}
            onGenderChange={setGender}
          />

          {/* Avatar */}
          <AvatarSelector
            selectedAvatarId={avatarId}
            onAvatarSelect={setAvatarId}
            variant="dropdown"
          />

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
              disabled={isSubmitting || !name.trim()}
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
