import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

interface BingoCongratulationsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onStarClaimed: () => void;
}

export const BingoCongratulationsDialog: React.FC<BingoCongratulationsDialogProps> = ({
  isOpen,
  onClose,
  onStarClaimed
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [starClaimed, setStarClaimed] = useState(false);

  const handleClaimStar = () => {
    setStarClaimed(true);
    onStarClaimed();
  };

  const handleDialogClose = () => {
    if (!starClaimed) {
      setShowConfirmDialog(true);
    } else {
      onClose();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleDialogClose}>
        <DialogContent 
          className="sm:max-w-md" 
          onPointerDownOutside={(e) => e.preventDefault()}
        >
        <div className="space-y-6 py-6 flex flex-col items-center">
          <h1 className="text-5xl font-bold text-dragon-green text-center">
            BRAVO!
          </h1>
          
          <img
            src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_11.webp"
            alt="Zmajček"
            className="w-48 h-48 object-contain"
          />
          
          <Button
            onClick={handleClaimStar}
            className="bg-yellow-500 hover:bg-yellow-600 text-white gap-2 px-8 text-lg"
          >
            ⭐ VZEMI ZVEZDICO
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    <ConfirmDialog
      open={showConfirmDialog}
      onOpenChange={setShowConfirmDialog}
      title="OPOZORILO"
      description="ALI RES ŽELIŠ ZAPRET OKNO? NE BOŠ PREJEL ZVEZDICE."
      confirmText="DA"
      cancelText="NE"
      onConfirm={() => {
        setShowConfirmDialog(false);
        onClose();
      }}
      onCancel={() => setShowConfirmDialog(false)}
    />
    </>
  );
};
