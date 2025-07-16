import { useEffect, useState } from "react";
import { X, Trophy } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface CongratulationsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  completionCount: number;
}

const dragonImage = "Zmajcek_3.png";

export const CongratulationsDialog = ({ 
  isOpen, 
  onClose, 
  completionCount 
}: CongratulationsDialogProps) => {
  const dragonUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/${dragonImage}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-b from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-emerald-200 dark:border-emerald-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 text-center">
            Čestitke!
          </DialogTitle>
          <DialogDescription className="text-emerald-700 dark:text-emerald-300 text-center">
            Uspešno ste opravili vse vaje motorike govoril!
          </DialogDescription>
        </DialogHeader>

        <div className="text-center pt-2 pb-4">
          <div className="flex justify-center mb-4">
            <div className="bg-emerald-500 text-white rounded-full p-3">
              <Trophy className="h-8 w-8" />
            </div>
          </div>

          <div className="mb-4">
            <img 
              src={dragonUrl} 
              alt="Čestitamo zmajček" 
              className="w-32 h-32 mx-auto rounded-full border-4 border-emerald-200 dark:border-emerald-700 shadow-lg object-cover"
              onError={(e) => {
                console.error("Failed to load dragon image:", dragonUrl);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          <div className="bg-white dark:bg-emerald-950 rounded-lg p-3 mb-4 border border-emerald-200 dark:border-emerald-800">
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              Bravo to je tvoja <strong>{completionCount}.</strong> uspešno izvedena vaja!
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