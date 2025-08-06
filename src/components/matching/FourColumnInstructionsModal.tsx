import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FourColumnInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FourColumnInstructionsModal: React.FC<FourColumnInstructionsModalProps> = ({
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
            <li>• V vsakem stolpcu je ena enaka beseda/element.</li>
            <li>• Poišči elemente, ki se ujemajo: zvok, beseda, senca in slika.</li>
            <li>• Klikni na vse štiri elemente, za katere misliš, da se ujemajo.</li>
            <li>• Če je povezava pravilna, se bodo vsi elementi obarvali zeleno.</li>
            <li>• Najdi vse štiri-kombinacije, da uspešno zaključiš igro!</li>
          </ul>
        </div>
        <div className="flex justify-end">
          <Button onClick={onClose}>Razumem</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};