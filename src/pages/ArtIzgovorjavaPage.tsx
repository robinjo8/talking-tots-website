import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import LetterSelector from "@/components/articulation/LetterSelector";
import WordPracticeCard from "@/components/articulation/WordPracticeCard";
import PracticeProgress from "@/components/articulation/PracticeProgress";

interface PracticeWord {
  id: number;
  word: string;
  translation?: string;
  audioUrl?: string;
}

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
    
  const currentWords = selectedLetter && letterPracticeWords[selectedLetter] 
    ? letterPracticeWords[selectedLetter] 
    : [];
  const currentWord = currentWords.length > currentWordIndex ? currentWords[currentWordIndex] : null;
  
  const audioRef = useRef<HTMLAudioElement>(null);
  
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    
    if (selectedLetter) {
      setCurrentWordIndex(0);
      setScore(0);
      setFeedbackMessage(null);
      setProgress(0);
    }
  }, [user, navigate, selectedLetter]);
  
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
    console.log(`Playing audio for word: ${currentWord?.word}`);
  };
  
  const handleMicRecord = () => {
    setIsRecording(true);
    
    setTimeout(() => {
      setIsRecording(false);
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
      alert("Čestitamo! Zaključil si vse vaje za to črko!");
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
        
        <LetterSelector 
          selectedLetter={selectedLetter}
          onLetterSelect={handleLetterSelect}
        />
        
        {selectedLetter && currentWord && (
          <>
            <PracticeProgress 
              currentWordIndex={currentWordIndex}
              totalWords={currentWords.length}
              progress={progress}
            />
            
            <WordPracticeCard
              currentWord={currentWord}
              selectedLetter={selectedLetter}
              isRecording={isRecording}
              showPositiveFeedback={showPositiveFeedback}
              feedbackMessage={feedbackMessage}
              score={score}
              onPlayAudio={handlePlayAudio}
              onMicRecord={handleMicRecord}
              onPlayCustomAudio={selectedLetter === "R" ? handlePlayRozaAudio : undefined}
            />
            
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
        
        <audio ref={audioRef} />
      </div>
    </div>
  );
};

export default ArtIzgovorjavaPage;
