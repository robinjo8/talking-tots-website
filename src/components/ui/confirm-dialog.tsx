
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
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel asChild>
            <Button 
              variant="outline" 
              disabled={isLoading}
              className="w-full sm:w-auto"
              onClick={handleCancel}
            >
              {cancelText}
            </Button>
          </AlertDialogCancel>
          <Button 
            variant={confirmVariant}
            disabled={isLoading}
            className="w-full sm:w-auto flex items-center gap-1 transition-all duration-150"
            onClick={handleConfirm}
          >
            {isLoading ? "Nalaganje..." : confirmText}
            {confirmIcon && !isLoading && confirmIcon}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
