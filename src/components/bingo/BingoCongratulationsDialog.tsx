import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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
  const handleClaimStar = () => {
    onStarClaimed();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-md" 
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <div className="space-y-6 py-6 flex flex-col items-center">
          <h1 className="text-5xl font-bold text-dragon-green text-center">
            BRAVO!
          </h1>
          
          <img
            src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_11.png"
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
  );
};
