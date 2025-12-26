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
      <DialogContent className="max-w-md sm:max-w-xl p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-lg sm:text-xl uppercase font-bold">
            IZBERI SLIKO
          </DialogTitle>
        </DialogHeader>
        
        <p className="text-center text-sm text-muted-foreground mb-4 uppercase">
          KATERA SLIKA SPADA NA MESTO {slotIndex + 1}?
        </p>
        
        {/* 4x2 grid for 8 images */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {images.map((image) => (
            <button
              key={image.id}
              onClick={() => onSelect(image)}
              className={cn(
                "relative aspect-square rounded-xl border-2 border-gray-200",
                "bg-white/90 overflow-hidden",
                "hover:border-orange-500 hover:scale-105 transition-all duration-200",
                "focus:outline-none",
                "shadow-md hover:shadow-xl"
              )}
            >
              {image.image_url && (
                <img
                  src={image.image_url}
                  alt={image.word || "Slika"}
                  className="w-full h-full object-contain p-1"
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
