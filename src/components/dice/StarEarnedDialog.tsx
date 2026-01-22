import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

interface StarEarnedDialogProps {
  isOpen: boolean;
  onClaimStar: () => void;
}

const SUPABASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public";

export function StarEarnedDialog({ isOpen, onClaimStar }: StarEarnedDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <div className="space-y-6 py-6 flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl font-bold text-dragon-green text-center uppercase">
            BRAVO!
          </h1>
          
          <p className="text-center text-base md:text-lg uppercase font-medium">
            OSVOJIL SI ZVEZDICO!
          </p>
          
          <img
            src={`${SUPABASE_URL}/zmajcki/Zmajcek_zvezdica.webp`}
            alt="Zmajček z zvezdico"
            className="w-40 h-40 md:w-48 md:h-48 object-contain"
          />
          
          <Button
            onClick={onClaimStar}
            className="bg-yellow-500 hover:bg-yellow-600 text-white gap-2 px-8 text-lg uppercase font-bold"
          >
            <Star className="w-5 h-5" />
            VZEMI ZVEZDICO
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
