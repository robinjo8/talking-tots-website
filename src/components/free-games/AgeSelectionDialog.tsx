import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AgeSelectionDialogProps {
  open: boolean;
  onAgeSelected: (age: number) => void;
}

const AGES = [3, 4, 5, 6, 7, 8, 9, 10];

export function AgeSelectionDialog({ open, onAgeSelected }: AgeSelectionDialogProps) {
  const [selectedAge, setSelectedAge] = useState<number | null>(null);

  const handleConfirm = () => {
    if (selectedAge !== null) {
      onAgeSelected(selectedAge);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-dragon-green">
            BREZPLAČNE IGRE
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            Za najboljšo izkušnjo nam povej, koliko let ima tvoj otrok. 
            Igre bodo prilagojene njegovi starosti.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-center font-semibold mb-4 text-foreground">
            Starost otroka:
          </p>
          
          <div className="grid grid-cols-4 gap-3 max-w-xs mx-auto">
            {AGES.map((age) => (
              <button
                key={age}
                onClick={() => setSelectedAge(age)}
                className={`
                  w-14 h-14 rounded-xl font-bold text-lg transition-all
                  ${selectedAge === age 
                    ? 'bg-dragon-green text-white scale-110 shadow-lg' 
                    : 'bg-gray-100 text-foreground hover:bg-gray-200 hover:scale-105'
                  }
                `}
              >
                {age}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleConfirm}
          disabled={selectedAge === null}
          className="w-full bg-dragon-green hover:bg-dragon-green/90 text-white font-semibold py-6 text-lg"
        >
          ZAČNI Z IGRAMI
        </Button>
      </DialogContent>
    </Dialog>
  );
}
