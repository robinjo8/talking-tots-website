import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Volume2, Mic, CheckCircle, Smile } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface PracticeWord {
  id: number;
  word: string;
  translation?: string;
  audioUrl?: string;
}

// Map of letters to their practice words
const letterPracticeWords: Record<string, PracticeWord[]> = {
  "R": [
    { id: 1, word: "Riba", translation: "fish" },
    { id: 2, word: "Roka", translation: "hand" },
    { id: 3, word: "Roža", translation: "flower" },
    { id: 4, word: "Robot", translation: "robot" },
    { id: 5, word: "Račka", translation: "duck" },
  ],
  "L": [
    { id: 1, word: "Luna", translation: "moon" },
    { id: 2, word: "Lev", translation: "lion" },
    { id: 3, word: "Ladja", translation: "ship" },
    { id: 4, word: "Lopata", translation: "shovel" },
    { id: 5, word: "List", translation: "leaf" },
  ],
  "S": [
    { id: 1, word: "Sonce", translation: "sun" },
    { id: 2, word: "Soba", translation: "room" },
    { id: 3, word: "Sladoled", translation: "ice cream" },
    { id: 4, word: "Svinčnik", translation: "pencil" },
    { id: 5, word: "Sova", translation: "owl" },
  ],
  "Š": [
    { id: 1, word: "Šola", translation: "school" },
    { id: 2, word: "Šal", translation: "scarf" },
    { id: 3, word: "Špageti", translation: "spaghetti" },
    { id: 4, word: "Škarje", translation: "scissors" },
    { id: 5, word: "Številka", translation: "number" },
  ],
  "Č": [
    { id: 1, word: "Čebela", translation: "bee" },
    { id: 2, word: "Čokolada", translation: "chocolate" },
    { id: 3, word: "Čevelj", translation: "shoe" },
    { id: 4, word: "Čarovnik", translation: "wizard" },
    { id: 5, word: "Čoln", translation: "boat" },
  ],
  "Ž": [
    { id: 1, word: "Žaba", translation: "frog" },
    { id: 2, word: "Žoga", translation: "ball" },
    { id: 3, word: "Žirafa", translation: "giraffe" },
    { id: 4, word: "Žep", translation: "pocket" },
    { id: 5, word: "Življenje", translation: "life" },
  ],
  "C": [
    { id: 1, word: "Cesta", translation: "road" },
    { id: 2, word: "Copat", translation: "slipper" },
    { id: 3, word: "Cvet", translation: "flower" },
    { id: 4, word: "Cilj", translation: "goal" },
    { id: 5, word: "Center", translation: "center" },
  ],
  "Z": [
    { id: 1, word: "Zajec", translation: "rabbit" },
    { id: 2, word: "Zebra", translation: "zebra" },
    { id: 3, word: "Zvezda", translation: "star" },
    { id: 4, word: "Zob", translation: "tooth" },
    { id: 5, word: "Zima", translation: "winter" },
  ]
};

// Feedback messages
const positiveFeedback = [
  "Odlično!",
  "Super!",
  "Zelo dobro!",
  "Bravo!",
  "Fantastično!"
];

const tryAgainFeedback = [
  "Poskusi še enkrat!",
  "Še malo vaje!",
  "Skoraj ti je uspelo!",
  "Potrudi se še malo!",
  "Gremo še enkrat!"
];

const ArtIzgovorjavaPage = () => {
  const { user, profile, selectedChildIndex } = useAuth();
  const navigate = useNavigate();
  const { letter: urlLetter } = useParams();
  
  const [selectedLetter, setSelectedLetter] = useState<string | null>(urlLetter || null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [showPositiveFeedback, setShowPositiveFeedback] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const selectedChild = selectedChildIndex !== null && profile?.children 
    ? profile.children[selectedChildIndex] 
    : null;
  
  // Letters for selection
  const problematicLetters = ["R", "L", "S", "Š", "Č", "Ž", "C", "Z"];
  
  // Current word being practiced
  const currentWords = selectedLetter ? letterPracticeWords[selectedLetter] : [];
  const currentWord = currentWords[currentWordIndex];
  
  const audioRef = useRef<HTMLAudioElement>(null);
  
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    
    // Reset exercise state when letter changes
    if (selectedLetter) {
      setCurrentWordIndex(0);
      setScore(0);
      setFeedbackMessage(null);
      setProgress(0);
    }
  }, [user, navigate, selectedLetter]);
  
  // Update progress when word changes
  useEffect(() => {
    if (selectedLetter && currentWords.length > 0) {
      setProgress(((currentWordIndex + 1) / currentWords.length) * 100);
    }
  }, [currentWordIndex, currentWords.length, selectedLetter]);
  
  const handleLetterSelect = (letter: string) => {
    setSelectedLetter(letter);
    navigate(`/artikulacija/${letter}`, { replace: true });
  };
  
  const handlePlayAudio = () => {
    // Placeholder for audio playback functionality
    console.log(`Playing audio for word: ${currentWord?.word}`);
    // Will integrate actual audio playback in future
  };
  
  const handleMicRecord = () => {
    setIsRecording(true);
    
    // Placeholder for speech recognition - simulate recording for 2 seconds
    setTimeout(() => {
      setIsRecording(false);
      // Random success (80% chance of success for demo purposes)
      const isSuccess = Math.random() > 0.2;
      
      if (isSuccess) {
        const randomIndex = Math.floor(Math.random() * positiveFeedback.length);
        setFeedbackMessage(positiveFeedback[randomIndex]);
        setShowPositiveFeedback(true);
        setScore(prev => prev + 10);
      } else {
        const randomIndex = Math.floor(Math.random() * tryAgainFeedback.length);
        setFeedbackMessage(tryAgainFeedback[randomIndex]);
        setShowPositiveFeedback(false);
      }
    }, 2000);
  };
  
  const handleNextWord = () => {
    if (currentWordIndex < currentWords.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      setFeedbackMessage(null);
    } else {
      // Exercise complete
      alert("Čestitamo! Zaključil si vse vaje za to črko!");
      // Could navigate to a completion page or back to main page
    }
  };

  const handlePlayRozaAudio = () => {
    const audioUrl = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/audio-besede//Roza.mp3";
    
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-3xl mx-auto pt-32 pb-20 px-4">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2" 
            onClick={() => navigate("/govorno-jezikovne-vaje")}
          >
            <ArrowLeft className="h-4 w-4" />
            Nazaj
          </Button>
          
          <h1 className="text-2xl font-bold">
            Motnja izreke / artikulacije
            {selectedChild && (
              <span className="text-dragon-green ml-2">– {selectedChild.name}</span>
            )}
          </h1>
        </div>
        
        <div className="bg-gray-50 p-4 mb-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Izberi glas za vajo:</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {problematicLetters.map((letter) => (
              <Button
                key={letter}
                onClick={() => handleLetterSelect(letter)}
                variant={selectedLetter === letter ? "default" : "outline"}
                className={cn(
                  "text-lg font-bold min-w-14 h-14",
                  selectedLetter === letter && "bg-app-blue hover:bg-app-blue/90"
                )}
              >
                {letter}
              </Button>
            ))}
          </div>
        </div>
        
        {selectedLetter && currentWord && (
          <>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Napredek</span>
              <span className="text-sm font-medium">{currentWordIndex + 1}/{currentWords.length}</span>
            </div>
            <Progress value={progress} className="mb-6 h-3" />
            
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
                    onClick={handlePlayAudio}
                  >
                    <Volume2 className="mr-2 h-5 w-5" />
                    Poslušaj besedo
                  </Button>
                  
                  {selectedLetter === "R" && (
                    <Button 
                      className="bg-dragon-green hover:bg-dragon-green/90 h-14 text-lg"
                      onClick={handlePlayRozaAudio}
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
                    onClick={handleMicRecord}
                    disabled={isRecording}
                  >
                    <Mic className="mr-2 h-5 w-5" />
                    {isRecording ? "Snemam..." : "Ponovi besedo"}
                  </Button>
                </div>
                
                <audio ref={audioRef} />
                
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
            
            <div className="flex justify-end">
              <Button 
                className="bg-dragon-green hover:bg-dragon-green/90 h-12 px-6"
                onClick={handleNextWord}
              >
                Naprej
              </Button>
            </div>
          </>
        )}
        
        {selectedLetter && !currentWord && (
          <div className="p-8 text-center">
            <p className="text-lg">Ni vaj za izbrano črko.</p>
          </div>
        )}
        
        {!selectedLetter && (
          <div className="bg-light-cloud p-8 rounded-lg text-center animate-fade-in">
            <p className="text-lg mb-4">Izberi črko zgoraj za začetek vaje.</p>
            <p className="text-muted-foreground">
              Te vaje so namenjene pravilni izgovorjavi težavnih glasov kot so R, L, S, Š, ...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtIzgovorjavaPage;
