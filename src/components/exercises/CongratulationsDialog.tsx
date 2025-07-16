import { useEffect, useState } from "react";
import { X, Trophy } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface CongratulationsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  completionCount: number;
}

const dragonImages = [
  "Zmajcek_1.png",
  "Zmajcek_2.png", 
  "Zmajcek_4.png",
  "Zmajcek_7.png",
  "Zmajcek_8.png",
  "Zmajcek_9.png",
  "Zmajcek_10.png",
  "Zmajcek_11.png"
];

export const CongratulationsDialog = ({ 
  isOpen, 
  onClose, 
  completionCount 
}: CongratulationsDialogProps) => {
  const [randomDragon, setRandomDragon] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      const randomIndex = Math.floor(Math.random() * dragonImages.length);
      const selectedDragon = dragonImages[randomIndex];
      setRandomDragon(`https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/${selectedDragon}`);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-b from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-200 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center pt-6 pb-4">
          <div className="flex justify-center mb-4">
            <div className="bg-emerald-500 text-white rounded-full p-3">
              <Trophy className="h-8 w-8" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-2">
            Čestitke!
          </h2>

          <p className="text-emerald-700 dark:text-emerald-300 mb-4">
            Uspešno ste opravili vse vaje motorike govoril!
          </p>

          {randomDragon && (
            <div className="mb-4">
              <img 
                src={randomDragon} 
                alt="Čestitamo zmajček" 
                className="w-32 h-32 mx-auto rounded-full border-4 border-emerald-200 dark:border-emerald-700 shadow-lg"
                onError={(e) => {
                  console.error("Failed to load dragon image:", randomDragon);
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="bg-white dark:bg-emerald-950 rounded-lg p-3 mb-4 border border-emerald-200 dark:border-emerald-800">
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              To je vaša <strong>{completionCount}.</strong> uspešna izvedba vseh 27 vaj!
            </p>
          </div>

          <button
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Nadaljuj
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};