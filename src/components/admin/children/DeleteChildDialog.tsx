import React, { useState } from 'react';
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
import { useLogopedistChildren, LogopedistChild } from '@/hooks/useLogopedistChildren';

interface DeleteChildDialogProps {
  child: LogopedistChild;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteChildDialog({ child, open, onOpenChange }: DeleteChildDialogProps) {
  const { deleteChild } = useLogopedistChildren();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteChild.mutateAsync(child.id);
      onOpenChange(false);
    } catch (error) {
      // Napaka je že prikazana v hook-u
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Odstrani otroka?</AlertDialogTitle>
          <AlertDialogDescription>
            Ali ste prepričani, da želite odstraniti <strong>{child.name}</strong> iz svojega seznama?
            <br /><br />
            Vsi podatki o napredku bodo ohranjeni, vendar otrok ne bo več prikazan v vašem seznamu.
            To dejanje bo sprostilo eno mesto v vaši licenci.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Prekliči</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isDeleting ? 'Odstranjevanje...' : 'Odstrani'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
