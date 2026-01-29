
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";

interface WordDisplayProps {
  word: string;
  imageUrl: string | null;
  loading: boolean;
  currentIndex: number;
  totalWords: number;
  onPlayAudio: () => void;
}

const WordDisplay = ({
  word,
  imageUrl,
  loading,
  currentIndex,
  totalWords,
  onPlayAudio
}: WordDisplayProps) => {
  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {/* Word and progress */}
      <div className="text-center mb-4 w-full">
        <h2 className="text-3xl font-bold text-app-purple mb-2">
          {word}
        </h2>
        <p className="text-muted-foreground">
          Beseda {currentIndex + 1} od {totalWords}
        </p>
      </div>
      
      {/* Image container with aspect ratio */}
      <div className="w-full bg-white rounded-xl shadow-md overflow-hidden mb-3">
        <AspectRatio ratio={1/1}>
          {loading ? (
            <div className="w-full h-full animate-pulse bg-gray-200 rounded-xl flex items-center justify-center">
              <span className="text-gray-400">Nalaganje...</span>
            </div>
          ) : imageUrl ? (
            <img 
              src={imageUrl} 
              alt={word} 
              className="w-full h-full object-contain p-4"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Ni slike
            </div>
          )}
        </AspectRatio>
      </div>
      
      {/* Audio button - larger, more playful for children with microphone icon */}
      <Button 
        onClick={onPlayAudio}
        size="lg"
        className="bg-app-teal hover:bg-app-teal/90 text-white px-8 py-6 h-auto text-lg rounded-full shadow-md hover:shadow-lg transform transition-transform hover:scale-105"
      >
        <Mic className="mr-2 h-6 w-6" />
        Izgovori besedo
      </Button>
    </div>
  );
};

export default WordDisplay;
