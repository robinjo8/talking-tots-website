
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import { motion } from "framer-motion";

interface MemoryCardProps {
  index: number;
  imageUrl?: string | null;
  audioUrl?: string | null;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
}

export function MemoryCard({ 
  index, 
  imageUrl, 
  audioUrl, 
  isFlipped, 
  isMatched,
  onClick 
}: MemoryCardProps) {
  const { audioRef, playAudio } = useAudioPlayback();

  const handleClick = () => {
    onClick();
    if (audioUrl && !isFlipped) {
      playAudio(audioUrl);
    }
  };

  return (
    <motion.div
      initial={{ rotateY: 0 }}
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "perspective-1000 transform-style-preserve-3d cursor-pointer",
        isMatched && "opacity-75"
      )}
    >
      <Card
        className={cn(
          "w-full aspect-square transition-all duration-300",
          "bg-gradient-to-br from-dragon-green/10 to-app-blue/10",
          "hover:scale-[1.02] active:scale-[0.98]",
          "border-2 border-dragon-green/20",
          "overflow-hidden backface-hidden"
        )}
        onClick={handleClick}
      >
        <audio ref={audioRef} className="hidden" />
        <div className="w-full h-full flex items-center justify-center">
          {isFlipped ? (
            <div className="rotate-y-180 w-full h-full">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt="" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-dragon-green">?</span>
                </div>
              )}
            </div>
          ) : (
            <span className="text-4xl font-bold text-dragon-green">?</span>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
