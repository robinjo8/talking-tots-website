import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Trophy } from "lucide-react";

interface TrophyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimTrophy?: () => void;
  childName?: string;
  totalStars?: number;
}

export const TrophyDialog = ({ isOpen, onClose, onClaimTrophy, childName, totalStars }: TrophyDialogProps) => {
  // Use Zmajcek_pokal.png for the trophy celebration
  const trophyImageUrl = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_pokal.png";

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
          // Prevent closing by clicking outside when onClaimTrophy is provided
          if (onClaimTrophy) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          // Prevent closing by pressing Escape when onClaimTrophy is provided
          if (onClaimTrophy) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-yellow-800 dark:text-yellow-200 text-center">
            🎉 ČESTITKE! 🎉
          </DialogTitle>
          <DialogDescription className="text-yellow-700 dark:text-yellow-300 text-center">
            {childName ? `Čestitamo ${childName} za osvojeni pokal!` : "Dosegli ste 100 zvezd!"}
          </DialogDescription>
        </DialogHeader>

        <div className="text-center pt-2 pb-4">
          <div className="flex justify-center mb-4">
            <div className="bg-yellow-500 text-white rounded-full p-3">
              <Trophy className="h-8 w-8" />
            </div>
          </div>

          <div className="mb-4">
            <img 
              src={trophyImageUrl} 
              alt="Zmajček s pokalom" 
              className="w-40 h-40 mx-auto rounded-lg shadow-lg object-contain bg-yellow-50/50"
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
            <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
              {childName 
                ? `Bravo ${childName}! Osvojil/a si pokal!` 
                : "Bravo! Osvojili ste svoj prvi pokal!"}
            </p>
          </div>

          <button
            onClick={handleClaimTrophy}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium transition-colors text-lg shadow-md"
          >
            {onClaimTrophy ? "Vzemi pokal" : "Nadaljuj z vajami"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
