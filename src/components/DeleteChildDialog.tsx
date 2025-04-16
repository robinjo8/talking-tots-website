
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type DeleteChildDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  childName?: string;
  isDeleting: boolean;
  onConfirm: () => void;
};

export function DeleteChildDialog({
  open,
  onOpenChange,
  childName,
  isDeleting,
  onConfirm
}: DeleteChildDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Potrdite brisanje otroka</AlertDialogTitle>
          <AlertDialogDescription>
            Ali ste prepričani, da želite izbrisati profil otroka
            {childName ? ` "${childName}"` : ""}? 
            Tega dejanja ni mogoče razveljaviti.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Prekliči</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Brisanje..." : "Izbriši"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
