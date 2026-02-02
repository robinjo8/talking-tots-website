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
}

const ArticulationResumeDialog = ({
  open,
  onResume,
  onStartOver,
  wordName,
}: ArticulationResumeDialogProps) => {
  const handleClose = () => {
    // X button triggers "start over" behavior - returning to previous page
    onStartOver();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            🔄 Nadaljevanje preverjanja
          </DialogTitle>
          <DialogDescription className="text-base">
            Zaznali smo nedokončano preverjanje. Ali želite nadaljevati?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-base text-gray-700">
            Zadnja izgovorjena beseda je bila:{" "}
            <span className="font-semibold">{wordName.toUpperCase()}</span>
          </p>
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
