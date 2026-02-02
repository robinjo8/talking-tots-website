import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { sl } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface AdminChildBasicInfoStepProps {
  name: string;
  birthDate: Date | null;
  gender: 'male' | 'female' | null;
  notes: string;
  externalId: string;
  onNameChange: (name: string) => void;
  onBirthDateChange: (date: Date | null) => void;
  onGenderChange: (gender: 'male' | 'female') => void;
  onNotesChange: (notes: string) => void;
  onExternalIdChange: (id: string) => void;
  onNext: () => void;
  onCancel: () => void;
}

export function AdminChildBasicInfoStep({
  name,
  birthDate,
  gender,
  notes,
  externalId,
  onNameChange,
  onBirthDateChange,
  onGenderChange,
  onNotesChange,
  onExternalIdChange,
  onNext,
  onCancel,
}: AdminChildBasicInfoStepProps) {
  const isValid = name.trim().length > 0 && birthDate !== null;

  // Calculate age from birth date for display
  const calculateAge = (date: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
      age--;
    }
    return Math.max(0, age);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-bold">Osnovni podatki</h2>
        <p className="text-muted-foreground">
          Vnesite osnovne podatke o otroku
        </p>
      </div>

      <div className="space-y-4">
        {/* Ime otroka */}
        <div className="space-y-2">
          <Label htmlFor="name">Ime otroka *</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Npr. Žan Novak"
            required
          />
        </div>

        {/* Datum rojstva */}
        <div className="space-y-2">
          <Label>Datum rojstva *</Label>
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
                {birthDate ? (
                  <>
                    {format(birthDate, "d. MMMM yyyy", { locale: sl })}
                    <span className="ml-auto text-muted-foreground">
                      ({calculateAge(birthDate)} {calculateAge(birthDate) === 1 ? 'leto' : calculateAge(birthDate) < 5 ? 'leta' : 'let'})
                    </span>
                  </>
                ) : (
                  "Izberite datum"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={birthDate || undefined}
                onSelect={(date) => onBirthDateChange(date || null)}
                disabled={(date) => date > new Date() || date < new Date("2005-01-01")}
                initialFocus
                locale={sl}
                captionLayout="dropdown-buttons"
                fromYear={2005}
                toYear={new Date().getFullYear()}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Spol */}
        <div className="space-y-2">
          <Label>Spol</Label>
          <RadioGroup
            value={gender || ''}
            onValueChange={(value) => onGenderChange(value as 'male' | 'female')}
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

        {/* Zapiski */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notranji zapiski (opcijsko)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
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
            onChange={(e) => onExternalIdChange(e.target.value)}
            placeholder="Npr. PAC-2024-042"
          />
          <p className="text-xs text-muted-foreground">
            ID iz vaše prakse za lažje sledenje
          </p>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Prekliči
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className="bg-dragon-green hover:bg-dragon-green/90"
        >
          Naprej
        </Button>
      </div>
    </div>
  );
}
