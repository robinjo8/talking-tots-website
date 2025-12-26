import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SequenceImage } from "@/hooks/useSequenceGame";
import { cn } from "@/lib/utils";

interface SequenceImageSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  images: SequenceImage[];
  onSelect: (image: SequenceImage) => void;
  slotIndex: number;
}

export const SequenceImageSelectionDialog = ({
  isOpen,
  onClose,
  images,
  onSelect,
  slotIndex
}: SequenceImageSelectionDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md sm:max-w-lg p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-lg sm:text-xl uppercase font-bold">
            IZBERI PRAVILNO SLIKO
          </DialogTitle>
        </DialogHeader>
        
        <p className="text-center text-sm text-muted-foreground mb-4 uppercase">
          KATERA SLIKA SPADA NA MESTO {slotIndex + 1}?
        </p>
        
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {images.map((image) => (
            <button
              key={image.id}
              onClick={() => onSelect(image)}
              className={cn(
                "relative aspect-square rounded-xl border-3 border-orange-300",
                "bg-white/90 overflow-hidden",
                "hover:border-orange-500 hover:scale-105 transition-all duration-200",
                "focus:outline-none focus:ring-4 focus:ring-orange-400/50",
                "shadow-md hover:shadow-xl"
              )}
            >
              {image.image_url && (
                <img
                  src={image.image_url}
                  alt={image.word || "Slika"}
                  className="w-full h-full object-contain p-2"
                  draggable={false}
                />
              )}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
