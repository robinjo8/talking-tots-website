import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { AddChildForm } from "@/components/AddChildForm";
import { CalendarIcon, HelpCircle } from "lucide-react";

interface SimpleChildFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function SimpleChildForm({ onSuccess, onCancel }: SimpleChildFormProps) {
  const [showNameOnly, setShowNameOnly] = useState(true);
  const [childName, setChildName] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [gender, setGender] = useState<string>("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);

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
    setPopoverOpen(false);
    setDialogOpen(false);
  };

  const canContinue = childName.trim().length > 0 && birthDate !== null;

  const handleBackFromAvatar = () => {
    setShowNameOnly(true);
  };

  if (!showNameOnly) {
    return <AddChildForm onSuccess={onSuccess} onBack={handleBackFromAvatar} initialName={childName} initialBirthDate={birthDate} initialGender={gender} />;
  }

  const CalendarContent = (
    <Calendar
      mode="single"
      selected={birthDate ?? undefined}
      onSelect={handleDateSelect}
      initialFocus
    />
  );

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
          <Label>Spol (neobvezno)</Label>
          <RadioGroup value={gender} onValueChange={setGender} className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="M" id="gender-m" />
              <Label htmlFor="gender-m" className="font-normal cursor-pointer">M</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="F" id="gender-f" />
              <Label htmlFor="gender-f" className="font-normal cursor-pointer">Ž</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="N" id="gender-n" />
              <Label htmlFor="gender-n" className="font-normal cursor-pointer">Ne želim izbrati</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <Label htmlFor="birth-date">Datum rojstva otroka (obvezno)</Label>
            <button
              type="button"
              onClick={() => setInfoDialogOpen(true)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
          </div>

          <Dialog open={infoDialogOpen} onOpenChange={setInfoDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-center">Zakaj potrebujemo datum rojstva?</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground text-justify leading-relaxed">
                Datum rojstva otroka je obvezen podatek, saj aplikacija na njegovi podlagi samodejno izračuna starost. Delovanje aplikacije je namreč prilagojeno razvojnemu obdobju otroka – glede na starost se prilagodijo vsebine, težavnosti iger in vaj. Poleg tega je ta podatek pri naročniškem paketu TomiTalk Pro ključen tudi za strokovno delo, saj logopedinji pri poslušanju posnetkov izgovorjave potrebujeta informacijo o starosti otroka, ki predstavlja pomemben del strokovne logopedske ocene.
              </p>
            </DialogContent>
          </Dialog>
          
          {/* Desktop: Popover */}
          <div className="hidden md:block">
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="birth-date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !birthDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {birthDate ? format(birthDate, "dd.MM.yyyy") : "Izberite datum rojstva"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[100]" align="start">
                {CalendarContent}
              </PopoverContent>
            </Popover>
          </div>

          {/* Mobile: Dialog */}
          <div className="md:hidden">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(true)}
              className={cn(
                "w-full justify-start text-left font-normal",
                !birthDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {birthDate ? format(birthDate, "dd.MM.yyyy") : "Izberite datum rojstva"}
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent className="w-auto max-w-[320px] p-4">
                <DialogHeader>
                  <DialogTitle className="text-center text-lg">
                    Izberite datum rojstva
                  </DialogTitle>
                </DialogHeader>
                <div className="flex justify-center pt-2">
                  {CalendarContent}
                </div>
              </DialogContent>
            </Dialog>
          </div>
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