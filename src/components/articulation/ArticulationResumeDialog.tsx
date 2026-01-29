import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RotateCcw, Play } from "lucide-react";

interface ArticulationResumeDialogProps {
  open: boolean;
  onResume: () => void;
  onStartOver: () => void;
  wordName: string;
  wordIndex: number;
  totalWords: number;
  timeAgo: string;
}

const ArticulationResumeDialog = ({
  open,
  onResume,
  onStartOver,
  wordName,
  wordIndex,
  totalWords,
  timeAgo,
}: ArticulationResumeDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            🔄 Nadaljevanje preverjanja
          </DialogTitle>
          <DialogDescription className="text-base">
            Zaznali smo nedokončano preverjanje. Ali želite nadaljevati?
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-lg">📍</span>
              <span>
                Zadnja beseda:{" "}
                <span className="font-semibold">{wordName.toUpperCase()}</span>{" "}
                <span className="text-gray-500">
                  ({wordIndex + 1}/{totalWords})
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <span className="text-lg">⏱️</span>
              <span>Shranjeno: {timeAgo}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onStartOver}
            variant="outline"
            className="flex-1 gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Začni znova
          </Button>
          <Button
            onClick={onResume}
            className="flex-1 gap-2 bg-teal-500 hover:bg-teal-600"
          >
            <Play className="w-4 h-4" />
            Nadaljuj
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArticulationResumeDialog;
