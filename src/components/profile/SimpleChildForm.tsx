import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { AddChildForm } from "@/components/AddChildForm";

interface SimpleChildFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function SimpleChildForm({ onSuccess, onCancel }: SimpleChildFormProps) {
  const [showNameOnly, setShowNameOnly] = useState(true);
  const [childName, setChildName] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleContinue = () => {
    if (!childName.trim() || !birthDate) return;
    setShowNameOnly(false);
  };

  const handleBack = () => {
    if (onCancel) {
      onCancel();
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setBirthDate(date || null);
    setCalendarOpen(false);
  };

  const canContinue = childName.trim().length > 0 && birthDate !== null;

  if (!showNameOnly) {
    return <AddChildForm onSuccess={onSuccess} initialName={childName} initialBirthDate={birthDate} />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dodaj otroka</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="childName">Ime otroka ali vzdevek</Label>
          <Input
            id="childName"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            placeholder="Vnesite ime otroka"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="birth-date">Datum rojstva otroka *</Label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
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
            <PopoverContent className="w-auto p-0 z-[100]" align="start">
              <Calendar
                mode="single"
                selected={birthDate ?? undefined}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex justify-between pt-2">
          <Button
            variant="outline"
            onClick={handleBack}
          >
            Nazaj
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!canContinue}
            className="bg-dragon-green hover:bg-dragon-green/90"
          >
            Nadaljuj
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}