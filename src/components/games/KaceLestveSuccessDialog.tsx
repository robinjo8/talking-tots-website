import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface KaceLestveSuccessDialogProps {
  isOpen: boolean;
  winnerName: string;
  onClaimStar: () => void;
  onNewGame: () => void;
}

export function KaceLestveSuccessDialog({
  isOpen,
  winnerName,
  onClaimStar,
  onNewGame,
}: KaceLestveSuccessDialogProps) {
  const [starClaimed, setStarClaimed] = useState(false);
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  const handleClaimStar = () => {
    setStarClaimed(true);
    onClaimStar();
  };

  const handleClose = () => {
    if (!starClaimed) {
      setShowConfirmClose(true);
    } else {
      onNewGame();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent
          className="sm:max-w-sm"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <div className="flex flex-col items-center gap-6 py-6">
            <h1 className="text-5xl font-bold text-dragon-green text-center">BRAVO!</h1>

            <img
              src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_11.webp"
              alt="Zmajček"
              className="w-48 h-48 object-contain"
            />

            {winnerName && (
              <p className="text-lg font-bold text-foreground text-center">
                🏆 {winnerName} ZMAGA!
              </p>
            )}

            {!starClaimed ? (
              <Button
                onClick={handleClaimStar}
                className="bg-yellow-500 hover:bg-yellow-600 text-white gap-2 px-8 text-lg font-bold"
              >
                ⭐ VZEMI ZVEZDICO
              </Button>
            ) : (
              <>
                <p className="text-2xl">⭐</p>
                <Button
                  onClick={onNewGame}
                  className="bg-dragon-green hover:bg-dragon-green/90 text-white px-8 font-bold"
                >
                  NOVA IGRA
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={showConfirmClose}
        onOpenChange={setShowConfirmClose}
        title="OPOZORILO"
        description="ALI RES ŽELIŠ ZAPRET OKNO? NE BOŠ PREJEL ZVEZDICE."
        confirmText="DA"
        cancelText="NE"
        onConfirm={() => {
          setShowConfirmClose(false);
          onNewGame();
        }}
        onCancel={() => setShowConfirmClose(false)}
      />
    </>
  );
}
