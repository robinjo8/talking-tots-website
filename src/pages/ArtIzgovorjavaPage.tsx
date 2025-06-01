
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
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import { handlePlayRozaAudio } from "@/utils/audioUtils";

const ArtIzgovorjavaPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { letter: urlLetter } = useParams();
  const { audioRef, playAudio } = useAudioPlayback();
    
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
    if (currentWord?.audioUrl) {
      playAudio(currentWord.audioUrl);
    }
  };
  
  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-5xl mx-auto pt-32 pb-20 px-4">
        <div className="flex items-center gap-3 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2" 
            onClick={() => navigate("/govorno-jezikovne-vaje")}
          >
            <ArrowLeft className="h-4 w-4" />
            Nazaj
          </Button>
          
          <h1 className="text-2xl font-bold text-foreground">
            Motnja izreke / artikulacije
          </h1>
        </div>
        
        <p className="text-muted-foreground mb-8">
          Te vaje so namenjene pravilni izgovorjavi težavnih glasov kot so R, L, S, Š, ...
        </p>
        
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
          </div>
        )}
        
        <audio ref={audioRef} />
      </div>
    </div>
  );
};

export default ArtIzgovorjavaPage;
