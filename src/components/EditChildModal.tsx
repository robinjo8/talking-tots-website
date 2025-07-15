
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EditChildForm } from "@/components/EditChildForm";

type EditChildModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  childName: string;
  childIndex: number;
  initialData: {
    name: string;
    gender: string;
    avatarId: number;
    birthDate?: Date | null;
  };
  onSuccess: () => void;
};

export function EditChildModal({ 
  open, 
  onOpenChange, 
  childName, 
  childIndex, 
  initialData,
  onSuccess
}: EditChildModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Urejanje otroka: {childName}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <EditChildForm 
            childIndex={childIndex}
            initialData={initialData}
            onSuccess={() => {
              onSuccess();
              onOpenChange(false);
            }}
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
