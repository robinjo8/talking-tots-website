import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Check, X } from "lucide-react";

interface MemoryExitConfirmationDialogProps {
  children: React.ReactNode;
  onConfirm: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function MemoryExitConfirmationDialog({ children, onConfirm, open, onOpenChange }: MemoryExitConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center uppercase">OPOZORILO</AlertDialogTitle>
          <AlertDialogDescription className="text-center uppercase">
            ALI RES ŽELITE PREKINITI IGRO?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row justify-center sm:justify-center items-center gap-4 mt-6">
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-8 py-3 text-base font-medium min-w-[100px] uppercase"
          >
            <Check className="w-5 h-5 mr-2" />
            DA
          </AlertDialogAction>
          <AlertDialogCancel className="bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600 rounded-lg px-8 py-3 text-base font-medium min-w-[100px] uppercase">
            <X className="w-5 h-5 mr-2" />
            NE
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
