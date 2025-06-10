
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import { useArticulationTest } from "@/hooks/useArticulationTest";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import LetterSlider from "@/components/articulation/LetterSlider";
import WordDisplay from "@/components/articulation/WordDisplay";
import Header from "@/components/Header";
import { PageHeader } from "@/components/PageHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const ArtikuacijskiTest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { playAudio } = useAudioPlayback();
  const {
    imageUrl,
    loading,
    currentLetter,
    allLetters,
    overallIndex,
    totalWords,
    handleNext,
    handlePrevious,
    getCurrentWord,
    setCurrentLetter
  } = useArticulationTest();

  React.useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handlePlayAudio = () => {
    // For now, we'll use text-to-speech since we don't have audio files
    const utterance = new SpeechSynthesisUtterance(getCurrentWord());
    utterance.lang = 'sl-SI'; // Slovenian language
    utterance.rate = 0.8; // Slightly slower for children
    speechSynthesis.speak(utterance);
  };

  // Calculate current letter progress
  const currentLetterIndex = allLetters.indexOf(currentLetter);
  const totalLetters = allLetters.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageHeader title="Artikulacijski Test" backPath="/govorno-jezikovne-vaje" />
      
      {/* Main container with responsive layout */}
      <div className="container max-w-6xl mx-auto px-4 py-6 md:py-8">
        {/* Letter slider - responsive positioning */}
        <div className="w-full max-w-3xl mx-auto mb-6 md:mb-8">
          <LetterSlider
            letters={allLetters}
            currentLetter={currentLetter}
            onLetterChange={setCurrentLetter}
          />
        </div>

        {/* Progress indicator - centered and responsive */}
        <div className="flex justify-center mb-6 md:mb-8">
          <div className="text-center">
            <p className="text-sm md:text-base font-medium text-muted-foreground">
              Črka {currentLetterIndex + 1} od {totalLetters}
            </p>
          </div>
        </div>
        
        {/* Main content area - responsive layout with side navigation */}
        <div className="flex items-center justify-center min-h-[400px] md:min-h-[500px]">
          <div className="w-full max-w-5xl mx-auto">
            {/* Mobile layout - stacked */}
            {isMobile ? (
              <div className="flex flex-col items-center space-y-6">
                {/* Word display */}
                <div className="w-full max-w-sm">
                  <WordDisplay
                    word={getCurrentWord()}
                    imageUrl={imageUrl}
                    loading={loading}
                    currentIndex={overallIndex}
                    totalWords={totalWords}
                    onPlayAudio={handlePlayAudio}
                  />
                </div>
                
                {/* Navigation buttons */}
                <div className="flex items-center justify-between w-full max-w-xs gap-4">
                  <Button 
                    onClick={handlePrevious}
                    variant="outline"
                    size="icon"
                    className="rounded-full h-12 w-12 border-2 flex-shrink-0"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  
                  <Button 
                    onClick={handleNext}
                    size="icon"
                    className="bg-app-blue hover:bg-app-blue/90 rounded-full h-14 w-14 shadow-md flex-shrink-0"
                  >
                    <ArrowRight className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            ) : (
              /* Desktop layout - side by side */
              <div className="flex items-center justify-center gap-6 lg:gap-12">
                {/* Previous button */}
                <Button 
                  onClick={handlePrevious}
                  variant="outline"
                  size="icon"
                  className="rounded-full h-14 w-14 lg:h-16 lg:w-16 border-2 flex-shrink-0"
                >
                  <ArrowLeft className="h-6 w-6 lg:h-7 lg:w-7" />
                </Button>

                {/* Word display - centered */}
                <div className="flex-1 max-w-md lg:max-w-lg">
                  <WordDisplay
                    word={getCurrentWord()}
                    imageUrl={imageUrl}
                    loading={loading}
                    currentIndex={overallIndex}
                    totalWords={totalWords}
                    onPlayAudio={handlePlayAudio}
                  />
                </div>

                {/* Next button */}
                <Button 
                  onClick={handleNext}
                  size="icon"
                  className="bg-app-blue hover:bg-app-blue/90 rounded-full h-16 w-16 lg:h-18 lg:w-18 shadow-md flex-shrink-0"
                >
                  <ArrowRight className="h-7 w-7 lg:h-8 lg:w-8" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtikuacijskiTest;
