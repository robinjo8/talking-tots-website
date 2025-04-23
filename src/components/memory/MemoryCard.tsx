
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";

interface MemoryCardProps {
  index: number;
  imageUrl?: string;
  audioUrl?: string;
}

export function MemoryCard({ index, imageUrl, audioUrl }: MemoryCardProps) {
  const { audioRef, playAudio } = useAudioPlayback();

  const handleClick = () => {
    if (audioUrl) {
      playAudio(audioUrl);
    }
  };

  return (
    <Card
      className={cn(
        "w-full aspect-square cursor-pointer transition-all duration-300",
        "bg-gradient-to-br from-dragon-green/10 to-app-blue/10",
        "hover:scale-[1.02] active:scale-[0.98]",
        "border-2 border-dragon-green/20",
        "overflow-hidden"
      )}
      onClick={handleClick}
    >
      <audio ref={audioRef} className="hidden" />
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
    </Card>
  );
}
