import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Sparkles } from 'lucide-react';

interface SubscriptionRequiredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

export function SubscriptionRequiredModal({
  open,
  onOpenChange,
  title = 'Naročniški paket potreben',
  description = 'Ta vsebina je na voljo samo uporabnikom z aktivnim naročniškim paketom. Izberite paket, ki ustreza vašim potrebam.'
}: SubscriptionRequiredModalProps) {
  const navigate = useNavigate();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-app-orange/20 to-dragon-green/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-dragon-green" />
            </div>
            <AlertDialogTitle className="text-xl">{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Zapri</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => navigate('/cenik')}
            className="bg-dragon-green hover:bg-dragon-green/90"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Oglej si pakete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
