import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({
  isOpen,
  onClose
}) => {
  const content = [
    "Sestavljaj sliko, dokler ni cela.",
    "Ko bo slika končana, se bo predvajal posnetek logopeda.",
    "Dobro poslušaj, kako logoped izgovori besedo.",
    "Nato besedo jasno in glasno ponovi."
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center mb-4">
            Navodila za igro Sestavljanka
          </DialogTitle>
        </DialogHeader>
        <div className="px-2 pb-4">
          <div className="space-y-4">
            {content.map((paragraph, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-dragon-green rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-foreground leading-relaxed text-sm">{paragraph}</p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};