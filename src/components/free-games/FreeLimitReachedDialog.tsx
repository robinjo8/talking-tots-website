import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface FreeLimitReachedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FreeLimitReachedDialog({ open, onOpenChange }: FreeLimitReachedDialogProps) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-app-orange">
            DANES SI ŽE ODIGRAL 3 BREZPLAČNE IGRE
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-4">
            VEČ IGER, VAJ IN PREVERJANJE IZGOVORJAVE DOBIŠ V TOMITALK PRO PAKETU
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 pt-4">
          <Button
            onClick={() => navigate('/cenik')}
            className="w-full bg-dragon-green hover:bg-dragon-green/90 text-white font-semibold py-6 text-lg"
          >
            POGLEJ PAKETE
          </Button>
          
          <Button
            onClick={() => navigate('/brezplacne-igre')}
            variant="outline"
            className="w-full border-2 border-gray-300 font-semibold py-6 text-lg"
          >
            NAZAJ
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
