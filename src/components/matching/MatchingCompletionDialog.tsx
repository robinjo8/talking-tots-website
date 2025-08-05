import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { MatchingGameImage } from "@/data/matchingGameData";

interface MatchingCompletionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  images: MatchingGameImage[];
}

export const MatchingCompletionDialog: React.FC<MatchingCompletionDialogProps> = ({
  isOpen,
  onClose,
  images
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-dragon-green">
            <Trophy className="h-6 w-6" />
            Čestitamo!
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <p className="text-center text-lg">
            Uspešno ste povezali vse pare!
          </p>
          
          {/* Display images in 2x2 grid */}
          <div className="grid grid-cols-2 gap-4 mx-auto max-w-xs">
            {images.slice(0, 4).map((image, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <img 
                  src={image.url} 
                  alt={image.word}
                  className="w-20 h-20 object-cover rounded-lg border-2 border-dragon-green"
                />
                <span className="text-sm font-medium text-center">{image.word.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center">
          <Button onClick={onClose} className="bg-dragon-green hover:bg-dragon-green/90">
            Nadaljuj
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};