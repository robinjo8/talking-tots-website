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
import { DifficultyLevel, RecordingDuration } from "@/hooks/useArticulationSettings";

interface ArticulationSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  difficulty: DifficultyLevel;
  onDifficultyChange: (value: DifficultyLevel) => void;
  recordingDuration: RecordingDuration;
  onRecordingDurationChange: (value: RecordingDuration) => void;
}

const difficultyOptions: {
  value: DifficultyLevel;
  label: string;
  description: string;
}[] = [
  {
    value: "nizka",
    label: "Nizka",
    description: "Lažje preverjanje",
  },
  {
    value: "srednja",
    label: "Srednja (priporočeno)",
    description: "Za večino otrok",
  },
  {
    value: "visoka",
    label: "Visoka",
    description: "Strožje preverjanje",
  },
];

const durationOptions: {
  value: RecordingDuration;
  label: string;
  description: string;
}[] = [
  {
    value: 3,
    label: "3 sekunde",
    description: "Za hitrejše otroke",
  },
  {
    value: 4,
    label: "4 sekunde (priporočeno)",
    description: "Za večino otrok",
  },
  {
    value: 5,
    label: "5 sekund",
    description: "Za otroke z večjimi težavami",
  },
];

const ArticulationSettingsDialog = ({
  open,
  onClose,
  difficulty,
  onDifficultyChange,
  recordingDuration,
  onRecordingDurationChange,
}: ArticulationSettingsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Nastavitve preverjanja
          </DialogTitle>
          <DialogDescription>
            Izberite zahtevnost preverjanja in čas snemanja glede na sposobnosti otroka.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Difficulty Column */}
          <div>
            <h3 className="font-medium mb-3 text-sm uppercase tracking-wide text-muted-foreground">
              Zahtevnost preverjanja
            </h3>
            <RadioGroup
              value={difficulty}
              onValueChange={(value) => onDifficultyChange(value as DifficultyLevel)}
              className="space-y-3"
            >
              {difficultyOptions.map((option) => (
                <div
                  key={option.value}
                  className={`flex items-start space-x-3 p-3 rounded-lg border-2 transition-colors cursor-pointer ${
                    difficulty === option.value
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => onDifficultyChange(option.value)}
                >
                  <RadioGroupItem value={option.value} id={`diff-${option.value}`} className="mt-0.5" />
                  <div className="flex-1">
                    <Label
                      htmlFor={`diff-${option.value}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {option.label}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {option.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Recording Duration Column */}
          <div>
            <h3 className="font-medium mb-3 text-sm uppercase tracking-wide text-muted-foreground">
              Čas snemanja
            </h3>
            <RadioGroup
              value={String(recordingDuration)}
              onValueChange={(value) => onRecordingDurationChange(Number(value) as RecordingDuration)}
              className="space-y-3"
            >
              {durationOptions.map((option) => (
                <div
                  key={option.value}
                  className={`flex items-start space-x-3 p-3 rounded-lg border-2 transition-colors cursor-pointer ${
                    recordingDuration === option.value
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => onRecordingDurationChange(option.value)}
                >
                  <RadioGroupItem value={String(option.value)} id={`dur-${option.value}`} className="mt-0.5" />
                  <div className="flex-1">
                    <Label
                      htmlFor={`dur-${option.value}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {option.label}
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {option.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
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
