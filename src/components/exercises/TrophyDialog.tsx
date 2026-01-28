import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface TrophyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimTrophy?: () => void;
  childName?: string;
  totalStars?: number;
  trophyNumber?: number;
}

export const TrophyDialog = ({ isOpen, onClose, onClaimTrophy, childName, totalStars, trophyNumber }: TrophyDialogProps) => {
  const trophyImageUrl = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_pokal.webp";

  const handleClaimTrophy = () => {
    if (onClaimTrophy) {
      onClaimTrophy();
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClaimTrophy ? undefined : onClose}>
      <DialogContent 
        className="max-w-md mx-auto bg-gradient-to-b from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800"
        onPointerDownOutside={(e) => {
          if (onClaimTrophy) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (onClaimTrophy) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-yellow-800 dark:text-yellow-200 text-center">
            🎉 ČESTITKE! 🎉
          </DialogTitle>
          <DialogDescription className="text-lg text-yellow-700 dark:text-yellow-300 text-center uppercase">
            ČESTITAMO <span className="font-bold text-orange-500">{childName?.toUpperCase()}</span> ZA OSVOJENI POKAL!
          </DialogDescription>
        </DialogHeader>

        <div className="text-center pt-2 pb-4">
          <div className="mb-4">
            <img 
              src={trophyImageUrl} 
              alt="Zmajček s pokalom" 
              className="w-48 h-48 mx-auto rounded-lg shadow-lg object-contain bg-yellow-50/50"
              onError={(e) => {
                console.error("Failed to load trophy image:", trophyImageUrl);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          <div className="bg-white dark:bg-yellow-950 rounded-lg p-4 mb-4 border border-yellow-200 dark:border-yellow-800">
            {totalStars !== undefined && (
              <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                ⭐ {totalStars} ZVEZD ⭐
              </p>
            )}
            <p className="text-base text-yellow-600 dark:text-yellow-400 mt-2 uppercase">
              BRAVO, TO JE TVOJ <span className="font-bold text-orange-500">{trophyNumber}.</span> POKAL!
            </p>
          </div>

          <button
            onClick={handleClaimTrophy}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium transition-colors text-lg shadow-md uppercase"
          >
            {onClaimTrophy ? "VZEMI POKAL" : "NADALJUJ Z VAJAMI"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};