import { useState } from "react";
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
import { DifficultyLevel, RecordingDuration, WordCount } from "@/hooks/useArticulationSettings";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface ArticulationSettingsDialogProps {
  open: boolean;
  onClose: () => void;
  difficulty: DifficultyLevel;
  onDifficultyChange: (value: DifficultyLevel) => void;
  recordingDuration: RecordingDuration;
  onRecordingDurationChange: (value: RecordingDuration) => void;
  // Word count props (optional - only shown for children aged 5+)
  childAge?: number;
  wordCount?: WordCount;
  onWordCountChange?: (value: WordCount) => void;
  // When true, shows word count selection and uses non-dismissable mode
  isInitialSetup?: boolean;
}

const difficultyOptions: {
  value: DifficultyLevel;
  label: string;
}[] = [
  {
    value: "nizka",
    label: "Lahka",
  },
  {
    value: "srednja",
    label: "Srednja (priporočeno)",
  },
  {
    value: "visoka",
    label: "Težja",
  },
];

const durationOptions: {
  value: RecordingDuration;
  label: string;
}[] = [
  {
    value: 3,
    label: "3 sekunde",
  },
  {
    value: 4,
    label: "4 sekunde (priporočeno)",
  },
  {
    value: 5,
    label: "5 sekund",
  },
];

const wordCountOptions: {
  value: WordCount;
  label: string;
  description: string;
}[] = [
  {
    value: 60,
    label: "60 besed (priporočeno)",
    description: "Standardna različica za to starostno skupino",
  },
  {
    value: 20,
    label: "20 besed",
    description: "Za otroke z večjimi težavami v govoru",
  },
];

const ArticulationSettingsDialog = ({
  open,
  onClose,
  difficulty,
  onDifficultyChange,
  recordingDuration,
  onRecordingDurationChange,
  childAge,
  wordCount,
  onWordCountChange,
  isInitialSetup = false,
}: ArticulationSettingsDialogProps) => {
  const [showReducedConfirm, setShowReducedConfirm] = useState(false);
  const [showStandardConfirm, setShowStandardConfirm] = useState(false);
  
  // Word count is only visible during initial setup (before first test), never mid-test
  const showWordCount = isInitialSetup && childAge !== undefined && childAge >= 5 && onWordCountChange;

  const handleWordCountSelect = (value: WordCount) => {
    if (value === wordCount) return;
    
    if (value === 20) {
      setShowReducedConfirm(true);
    } else {
      setShowStandardConfirm(true);
    }
  };

  const confirmReducedWordCount = () => {
    onWordCountChange?.(20);
    setShowReducedConfirm(false);
  };

  const confirmStandardWordCount = () => {
    onWordCountChange?.(60);
    setShowStandardConfirm(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => {
        if (!isOpen && !isInitialSetup) onClose();
      }}>
        <DialogContent 
          className="sm:max-w-2xl max-h-[90vh] overflow-y-auto"
          onPointerDownOutside={isInitialSetup ? (e) => e.preventDefault() : undefined}
          onEscapeKeyDown={isInitialSetup ? (e) => e.preventDefault() : undefined}
          hideCloseButton={isInitialSetup}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              {isInitialSetup ? "Nastavitve pred začetkom preverjanja" : "Nastavitve preverjanja"}
            </DialogTitle>
            <DialogDescription>
              {isInitialSetup 
                ? "Pred začetkom preverjanja izberite zahtevnost, čas snemanja in število besed."
                : "Izberite zahtevnost preverjanja in čas snemanja."}
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
                    <Label
                      htmlFor={`diff-${option.value}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {option.label}
                    </Label>
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
                    <Label
                      htmlFor={`dur-${option.value}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          {/* Word Count Section - only for children aged 5+ */}
          {showWordCount && (
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                Število besed
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {wordCountOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-start space-x-3 p-3 rounded-lg border-2 transition-colors cursor-pointer ${
                      wordCount === option.value
                        ? "border-teal-500 bg-teal-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleWordCountSelect(option.value)}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center flex-shrink-0 ${
                      wordCount === option.value ? "border-teal-500" : "border-gray-300"
                    }`}>
                      {wordCount === option.value && (
                        <div className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{option.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {option.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={onClose} className="bg-teal-500 hover:bg-teal-600">
              {isInitialSetup ? "Potrdi in začni" : "Shrani"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation dialog for switching to 20 words */}
      <ConfirmDialog
        open={showReducedConfirm}
        onOpenChange={setShowReducedConfirm}
        title="Zmanjšano število besed"
        description="Za to starostno skupino se priporoča uporaba 60 besed za celovitejše preverjanje izgovorjave. Če ima otrok večje težave z govorom, lahko uporabite skrajšano različico z 20 besedami."
        confirmText="Potrdi"
        cancelText="Prekliči"
        onConfirm={confirmReducedWordCount}
        onCancel={() => setShowReducedConfirm(false)}
      />

      {/* Info dialog for switching back to 60 words */}
      <ConfirmDialog
        open={showStandardConfirm}
        onOpenChange={setShowStandardConfirm}
        title="Standardno število besed"
        description="Za preverjanje izgovorjave se bo uporabljalo 60 besed."
        confirmText="V redu"
        cancelText="Prekliči"
        onConfirm={confirmStandardWordCount}
        onCancel={() => setShowStandardConfirm(false)}
      />
    </>
  );
};

export default ArticulationSettingsDialog;
