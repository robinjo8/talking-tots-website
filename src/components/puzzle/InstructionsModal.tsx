import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({
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
            <li>• Sestavljaj sliko, dokler ni cela.</li>
            <li>• Ko bo slika končana, se bo predvajal posnetek logopeda.</li>
            <li>• Dobro poslušaj, kako logoped izgovori besedo.</li>
            <li>• Nato besedo jasno in glasno ponovi.</li>
          </ul>
        </div>
        <div className="flex justify-end">
          <Button onClick={onClose}>Razumem</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};