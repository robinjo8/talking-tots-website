import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface MatchingInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MatchingInstructionsModal: React.FC<MatchingInstructionsModalProps> = ({
  isOpen,
  onClose
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Navodila</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <ul className="space-y-2">
            <li>• V vsakem stolpcu je ena enaka sličica.</li>
            <li>• Poišči sličice, ki so enake, in jih poveži od leve proti desni.</li>
            <li>• Klikni na tiste, za katere misliš, da se ujemajo.</li>
            <li>• Če je povezava pravilna, se bo sličica obarvala zeleno.</li>
            <li>• Najdi vse pare, da uspešno zaključiš igro!</li>
          </ul>
        </div>
        <div className="flex justify-end">
          <Button onClick={onClose}>Razumem</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};