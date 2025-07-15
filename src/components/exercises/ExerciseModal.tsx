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
      console.log('Modal opened, attempting to play audio:', audioUrl);
      
      // Test if audio file exists first
      fetch(audioUrl, { method: 'HEAD' })
        .then(response => {
          if (response.ok) {
            console.log('Audio file exists, playing now');
            playAudio(audioUrl);
          } else {
            console.error('Audio file not found:', audioUrl, 'Status:', response.status);
          }
        })
        .catch(error => {
          console.error('Error checking audio file:', error);
          // Try to play anyway in case it's a CORS issue
          playAudio(audioUrl);
        });
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
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
      >
        <X className="h-6 w-6" />
      </button>

      <div className="w-full max-w-4xl mx-auto text-center">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {instruction}
          </h2>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-2xl">
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

        <button
          onClick={onComplete}
          className="mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
        >
          Dokončaj vajo
        </button>

        <div className="mt-4 text-white/70 text-sm">
          Vaja {cardNumber} od 27
        </div>
      </div>
    </div>
  );
};