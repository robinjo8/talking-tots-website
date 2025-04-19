
import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import LetterSelector from "@/components/articulation/LetterSelector";
import WordPracticeCard from "@/components/articulation/WordPracticeCard";
import PracticeProgress from "@/components/articulation/PracticeProgress";
import { letterPracticeWords } from "@/data/letterPracticeWords";
import { useWordPractice } from "@/hooks/useWordPractice";
import { handlePlayRozaAudio } from "@/utils/audioUtils";

const ArtIzgovorjavaPage = () => {
  const { user, profile, selectedChildIndex } = useAuth();
  const navigate = useNavigate();
  const { letter: urlLetter } = useParams();
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const selectedChild = selectedChildIndex !== null && profile?.children 
    ? profile.children[selectedChildIndex] 
    : null;
    
  const currentWords = urlLetter && letterPracticeWords[urlLetter] 
    ? letterPracticeWords[urlLetter] 
    : [];

  const {
    currentWordIndex,
    score,
    feedbackMessage,
    showPositiveFeedback,
    isRecording,
    progress,
    handleLetterSelect,
    handleMicRecord,
    handleNextWord,
  } = useWordPractice(urlLetter || null, currentWords);

  const currentWord = currentWords.length > currentWordIndex ? currentWords[currentWordIndex] : null;
  
  const handlePlayAudio = () => {
    console.log(`Playing audio for word: ${currentWord?.word}`);
  };
  
  if (!user) {
    navigate("/login");
    return null;
  }

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
          selectedLetter={urlLetter || null}
          onLetterSelect={handleLetterSelect}
        />
        
        {urlLetter && currentWord && (
          <>
            <PracticeProgress 
              currentWordIndex={currentWordIndex}
              totalWords={currentWords.length}
              progress={progress}
            />
            
            <WordPracticeCard
              currentWord={currentWord}
              selectedLetter={urlLetter}
              isRecording={isRecording}
              showPositiveFeedback={showPositiveFeedback}
              feedbackMessage={feedbackMessage}
              score={score}
              onPlayAudio={handlePlayAudio}
              onMicRecord={handleMicRecord}
              onPlayCustomAudio={urlLetter === "R" ? () => handlePlayRozaAudio(audioRef) : undefined}
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
        
        {urlLetter && !currentWord && (
          <div className="p-8 text-center">
            <p className="text-lg">Ni vaj za izbrano črko.</p>
          </div>
        )}
        
        {!urlLetter && (
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
