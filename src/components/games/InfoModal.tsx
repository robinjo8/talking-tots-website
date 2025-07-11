
import {
  Dialog,
  DialogContent,
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <div className="text-muted-foreground leading-relaxed space-y-3">
            {content.split('\n\n').map((paragraph, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-dragon-green font-bold mt-1">•</span>
                <span>{paragraph}</span>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
