
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export function InfoModal({ isOpen, onClose, title, content }: InfoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center mb-4">
            {title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Game instructions dialog
          </DialogDescription>
        </DialogHeader>
        <div className="px-2 pb-4">
          <div className="space-y-4">
            {content.split('\n\n').map((paragraph, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-dragon-green rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-foreground leading-relaxed text-sm">{paragraph}</p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
