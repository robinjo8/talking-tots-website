import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { DifficultyLevel } from "@/hooks/useArticulationSettings";

interface ArticulationSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  difficulty: DifficultyLevel;
  onDifficultyChange: (value: DifficultyLevel) => void;
}

const difficultyOptions: {
  value: DifficultyLevel;
  label: string;
  description: string;
  duration: string;
}[] = [
  {
    value: "nizka",
    label: "Nizka",
    description: "Za otroke z večjimi govornimi težavami",
    duration: "5 sekund",
  },
  {
    value: "srednja",
    label: "Srednja (priporočeno)",
    description: "Za večino otrok",
    duration: "4 sekunde",
  },
  {
    value: "visoka",
    label: "Visoka",
    description: "Za otroke brez večjih težav",
    duration: "3 sekunde",
  },
];

const ArticulationSettingsDialog = ({
  open,
  onClose,
  difficulty,
  onDifficultyChange,
}: ArticulationSettingsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Nastavitve preverjanja
          </DialogTitle>
          <DialogDescription>
            Izberite zahtevnost preverjanja glede na sposobnosti otroka.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <RadioGroup
            value={difficulty}
            onValueChange={(value) => onDifficultyChange(value as DifficultyLevel)}
            className="space-y-4"
          >
            {difficultyOptions.map((option) => (
              <div
                key={option.value}
                className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                  difficulty === option.value
                    ? "border-teal-500 bg-teal-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => onDifficultyChange(option.value)}
              >
                <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                <div className="flex-1">
                  <Label
                    htmlFor={option.value}
                    className="text-base font-medium cursor-pointer"
                  >
                    {option.label}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {option.description}
                  </p>
                  <p className="text-sm text-teal-600 mt-1 font-medium">
                    ⏱️ Čas snemanja: {option.duration}
                  </p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose} className="bg-teal-500 hover:bg-teal-600">
            Shrani
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArticulationSettingsDialog;
