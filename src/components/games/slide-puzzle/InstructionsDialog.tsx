
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface InstructionsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  size: number;
}

const InstructionsDialog: React.FC<InstructionsDialogProps> = ({ isOpen, onOpenChange, size }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kako igrati drsne številke</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <p><strong>Cilj:</strong> Razvrstite številke v pravilnem vrstnem redu od 1 do {size * size - 1}.</p>
          <p><strong>Kako:</strong> Kliknite na ploščico, ki se dotika praznega prostora, da jo premaknete.</p>
          <p><strong>Zmaga:</strong> Ko so vse številke urejene in je prazen prostor v spodnjem desnem kotu.</p>
          <p><strong>Namigi:</strong> Uporabite gumb "Namig" za pomoč ali "Razveljavi" za razveljavitev zadnje poteze.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InstructionsDialog;
