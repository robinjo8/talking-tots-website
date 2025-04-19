
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Volume2, Mic, CheckCircle, Smile } from "lucide-react";
import { cn } from "@/lib/utils";

interface PracticeWord {
  id: number;
  word: string;
  translation?: string;
  audioUrl?: string;
}

interface WordPracticeCardProps {
  currentWord: PracticeWord;
  selectedLetter: string;
  isRecording: boolean;
  showPositiveFeedback: boolean;
  feedbackMessage: string | null;
  score: number;
  onPlayAudio: () => void;
  onMicRecord: () => void;
  onPlayCustomAudio?: () => void;
}

const WordPracticeCard = ({
  currentWord,
  selectedLetter,
  isRecording,
  showPositiveFeedback,
  feedbackMessage,
  score,
  onPlayAudio,
  onMicRecord,
  onPlayCustomAudio
}: WordPracticeCardProps) => {
  return (
    <Card className="mb-6 overflow-hidden border-2 border-app-blue/20">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-app-blue">
              {selectedLetter}
            </span>
            <span className="text-xl font-semibold">
              v besedi:
            </span>
          </div>
          <div className="text-md text-dragon-green font-medium">
            Točke: {score}
          </div>
        </div>
        
        <div className="flex flex-col items-center mb-6 py-6">
          <h2 className="text-4xl font-bold mb-3 text-center min-h-16 animate-scale-in">
            {currentWord.word}
          </h2>
          {currentWord.translation && (
            <p className="text-muted-foreground italic">
              ({currentWord.translation})
            </p>
          )}
        </div>
        
        <div className="p-4 bg-light-cloud rounded-lg mb-6">
          <p className="text-center text-sm font-medium">
            Pri izgovorjavi glasu <strong>{selectedLetter}</strong> pravilno postavi jezik in ustnice.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Button 
            className="bg-app-purple hover:bg-app-purple/90 h-14 text-lg"
            onClick={onPlayAudio}
          >
            <Volume2 className="mr-2 h-5 w-5" />
            Poslušaj besedo
          </Button>
          
          {selectedLetter === "R" && onPlayCustomAudio && (
            <Button 
              className="bg-dragon-green hover:bg-dragon-green/90 h-14 text-lg"
              onClick={onPlayCustomAudio}
            >
              <Volume2 className="mr-2 h-5 w-5" />
              Poslušaj besedo Roza
            </Button>
          )}
          
          <Button 
            className={cn(
              "bg-app-orange hover:bg-app-orange/90 h-14 text-lg",
              isRecording && "animate-pulse bg-red-500"
            )}
            onClick={onMicRecord}
            disabled={isRecording}
          >
            <Mic className="mr-2 h-5 w-5" />
            {isRecording ? "Snemam..." : "Ponovi besedo"}
          </Button>
        </div>
        
        {feedbackMessage && (
          <div className={cn(
            "p-4 rounded-lg text-center animate-scale-in mb-4",
            showPositiveFeedback ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
          )}>
            <div className="flex items-center justify-center gap-2">
              {showPositiveFeedback ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <Smile className="h-5 w-5" />
              )}
              <span className="font-bold text-lg">{feedbackMessage}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WordPracticeCard;
