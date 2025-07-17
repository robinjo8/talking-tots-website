import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Trophy } from "lucide-react";

interface TrophyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  totalStars: number;
}

export const TrophyDialog = ({ isOpen, onClose, totalStars }: TrophyDialogProps) => {
  const trophyImageUrl = "/lovable-uploads/pokal.jpg";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-b from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-yellow-800 dark:text-yellow-200 text-center">
            🎉 ČESTITKE! 🎉
          </DialogTitle>
          <DialogDescription className="text-yellow-700 dark:text-yellow-300 text-center">
            Dosegli ste 100 zvezd!
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
              alt="Pokal za 100 zvezd" 
              className="w-32 h-32 mx-auto rounded-full border-4 border-yellow-200 dark:border-yellow-700 shadow-lg object-cover"
              onError={(e) => {
                console.error("Failed to load trophy image:", trophyImageUrl);
                // Show fallback trophy icon
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          <div className="bg-white dark:bg-yellow-950 rounded-lg p-4 mb-4 border border-yellow-200 dark:border-yellow-800">
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
              ⭐ {totalStars} ZVEZD ⭐
            </p>
            <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
              Bravo! Osvojili ste svoj prvi pokal!
            </p>
          </div>

          <button
            onClick={onClose}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Nadaljuj z vajami
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};