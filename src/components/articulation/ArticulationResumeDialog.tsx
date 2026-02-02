import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface ArticulationResumeDialogProps {
  open: boolean;
  onResume: () => void;
  onClose: () => void;
  wordName: string;
}

const ArticulationResumeDialog = ({
  open,
  onResume,
  onClose,
  wordName,
}: ArticulationResumeDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
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

        <div className="flex justify-center">
          <Button
            onClick={onResume}
            className="gap-2 bg-teal-500 hover:bg-teal-600 px-8"
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
