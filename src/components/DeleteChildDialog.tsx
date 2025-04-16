
import { Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

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
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Potrdite brisanje otroka"
      description={`Ali ste prepričani, da želite izbrisati profil otroka${childName ? ` "${childName}"` : ""}? Tega dejanja ni mogoče razveljaviti.`}
      confirmText={isDeleting ? "Brisanje..." : "Izbriši"}
      confirmVariant="destructive"
      confirmIcon={<Trash2 className="h-4 w-4" />}
      isLoading={isDeleting}
      onConfirm={onConfirm}
    />
  );
}
