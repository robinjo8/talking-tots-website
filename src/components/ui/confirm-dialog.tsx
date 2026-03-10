
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

export interface ConfirmDialogProps {
  /**
   * Controls whether the dialog is open
   */
  open: boolean;
  
  /**
   * Callback when the open state changes
   */
  onOpenChange: (open: boolean) => void;
  
  /**
   * The title of the confirmation dialog
   */
  title: string;
  
  /**
   * The description/message to display
   */
  description: string;
  
  /**
   * Text for the confirm button
   */
  confirmText?: string;
  
  /**
   * Text for the cancel button
   */
  cancelText?: string;
  
  /**
   * Optional icon to display with the confirm button
   */
  confirmIcon?: ReactNode;
  
  /**
   * Variant for the confirm button
   */
  confirmVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  
  /**
   * Loading state for the confirm button
   */
  isLoading?: boolean;
  
  /**
   * Callback when the confirm button is clicked
   */
  onConfirm: () => void;
  
  /**
   * Callback when the cancel button is clicked
   */
  onCancel?: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Potrdi",
  cancelText = "Prekliči",
  confirmIcon,
  confirmVariant = "default",
  isLoading = false,
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    onConfirm();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center uppercase">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row justify-center sm:justify-center items-center gap-4 mt-6">
          <AlertDialogAction
            disabled={isLoading}
            className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-8 py-3 text-base font-medium min-w-[100px] uppercase"
            onClick={handleConfirm}
          >
            <Check className="w-5 h-5 mr-2" />
            {isLoading ? "Nalaganje..." : confirmText}
          </AlertDialogAction>
          <AlertDialogCancel
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600 rounded-lg px-8 py-3 text-base font-medium min-w-[100px] uppercase"
            onClick={handleCancel}
          >
            <X className="w-5 h-5 mr-2" />
            {cancelText}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
