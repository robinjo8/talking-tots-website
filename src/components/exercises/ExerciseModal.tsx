import { useEffect } from "react";
import { X } from "lucide-react";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";

interface ExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardNumber: number;
  instruction: string;
  imageUrl: string;
  audioUrl: string;
  onComplete: () => void;
}

export const ExerciseModal = ({
  isOpen,
  onClose,
  cardNumber,
  instruction,
  imageUrl,
  audioUrl,
  onComplete,
}: ExerciseModalProps) => {
  const { playAudio } = useAudioPlayback();
  
  useEffect(() => {
    if (isOpen && audioUrl) {
      // Small delay to ensure modal is fully rendered
      const timer = setTimeout(() => {
        playAudio(audioUrl);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, audioUrl, playAudio]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
      >
        <X className="h-6 w-6" />
      </button>


      {/* Content */}
      <div className="w-full max-w-4xl mx-auto text-center">
        {/* Card number and instruction */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg mb-4">
            {cardNumber}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {instruction}
          </h2>
        </div>

        {/* Image */}
        <div className="relative bg-white rounded-xl p-4 shadow-2xl">
          <img
            src={imageUrl}
            alt={`Vaja ${cardNumber}: ${instruction}`}
            className="w-full max-w-2xl mx-auto rounded-lg"
            onError={(e) => {
              console.error('Failed to load exercise image:', imageUrl);
              e.currentTarget.style.border = '2px solid red';
              e.currentTarget.style.background = 'lightgray';
            }}
          />
        </div>

        {/* Progress indicator */}
        <div className="mt-6 text-white/70 text-sm">
          Vaja {cardNumber} od 27
        </div>
      </div>
    </div>
  );
};