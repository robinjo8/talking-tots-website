import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Check, X } from "lucide-react";

interface PuzzleConfirmationDialogProps {
  children: React.ReactNode;
  onConfirm: () => void;
}

export function PuzzleConfirmationDialog({ children, onConfirm }: PuzzleConfirmationDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">Potrditev</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Ali si res zaključil/a igro?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row justify-center sm:justify-center items-center gap-3 mt-6">
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-green-500 hover:bg-green-600 text-white rounded-md px-6 py-2"
          >
            <Check className="w-4 h-4 mr-2" />
            Da
          </AlertDialogAction>
          <AlertDialogCancel className="bg-red-500 hover:bg-red-600 text-white border-red-500 rounded-md px-6 py-2">
            <X className="w-4 h-4 mr-2" />
            Ne
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}