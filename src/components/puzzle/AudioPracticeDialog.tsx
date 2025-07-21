import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Volume2, Mic } from "lucide-react";

interface AudioPracticeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPlayAudio: () => void;
  onStartRecording: () => void;
  isAudioLoading: boolean;
  isRecording: boolean;
  feedbackMessage?: string;
  showPositiveFeedback: boolean;
}

export function AudioPracticeDialog({
  isOpen,
  onOpenChange,
  onPlayAudio,
  onStartRecording,
  isAudioLoading,
  isRecording,
  feedbackMessage,
  showPositiveFeedback
}: AudioPracticeDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Govorna vaja</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <h4 className="font-medium mb-3">Poslušajte in ponovite besedo:</h4>
            <div className="flex justify-center gap-3">
              <Button 
                onClick={onPlayAudio}
                disabled={isAudioLoading}
                variant="outline"
              >
                {isAudioLoading ? (
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
                <span className="ml-2">Predvajaj</span>
              </Button>
              
              <Button 
                onClick={onStartRecording}
                disabled={isRecording}
                className="bg-dragon-green hover:bg-dragon-green/90 text-white"
              >
                <Mic className="w-4 h-4 mr-2" />
                {isRecording ? "Snemam..." : "Posnemi se"}
              </Button>
            </div>
          </div>

          {feedbackMessage && (
            <div className={`text-center p-3 rounded-md ${
              showPositiveFeedback ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {feedbackMessage}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}