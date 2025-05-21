
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { AvatarSelector } from "@/components/AvatarSelector";
import { GenderSelector } from "@/components/GenderSelector";

type ChildBasicInfoFormProps = {
  name: string;
  birthDate: Date | null;
  gender: string;
  avatarId: number;
  onNameChange: (name: string) => void;
  onBirthDateChange: (date: Date | null) => void;
  onGenderChange: (gender: string) => void;
  onAvatarChange: (id: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
};

export function ChildBasicInfoForm({
  name,
  birthDate,
  gender,
  avatarId,
  onNameChange,
  onBirthDateChange,
  onGenderChange,
  onAvatarChange,
  onSubmit,
  title = "Dodaj novega otroka"
}: ChildBasicInfoFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="child-name">Ime otroka</Label>
          <Input
            id="child-name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Vnesite ime otroka"
            className="mt-1"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="birth-date">Datum rojstva otroka</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="birth-date"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !birthDate && "text-muted-foreground"
                )}
              >
                {birthDate ? format(birthDate, "dd.MM.yyyy") : "Izberite datum rojstva"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={birthDate}
                onSelect={onBirthDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <GenderSelector 
          selectedGender={gender} 
          onGenderChange={onGenderChange} 
        />
        
        <AvatarSelector 
          selectedAvatarId={avatarId} 
          onAvatarSelect={onAvatarChange} 
        />
      </div>
      
      <div className="pt-4">
        <Button
          type="submit"
          className="w-full bg-dragon-green hover:bg-dragon-green/90"
        >
          Naprej
        </Button>
      </div>
    </form>
  );
}
