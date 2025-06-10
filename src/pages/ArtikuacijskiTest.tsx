
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
      
      {/* Main container with proper spacing */}
      <div className="container max-w-4xl mx-auto px-4 py-4 space-y-6">
        {/* Letter slider with proper overflow handling */}
        <div className="w-full">
          <LetterSlider
            letters={allLetters}
            currentLetter={currentLetter}
            onLetterChange={setCurrentLetter}
          />
        </div>

        {/* Main content area - responsive layout */}
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-full max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-4 md:gap-8">
              {/* Previous button */}
              <Button 
                onClick={handlePrevious}
                variant="outline"
                size="icon"
                className="rounded-full h-12 w-12 md:h-14 md:w-14 border-2 flex-shrink-0"
              >
                <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
              </Button>

              {/* Central content */}
              <div className="flex-1 max-w-sm md:max-w-md">
                <div className="flex flex-col items-center space-y-4">
                  {/* Word title */}
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-app-purple text-center">
                    {getCurrentWord()}
                  </h2>
                  
                  {/* Progress indicators on same row */}
                  <div className="flex items-center justify-center gap-3 text-sm md:text-base text-muted-foreground">
                    <span>Črka {currentLetterIndex + 1} od {totalLetters}</span>
                    <span>•</span>
                    <span>Beseda {overallIndex + 1} od {totalWords}</span>
                  </div>
                  
                  {/* Image container with consistent sizing */}
                  <div className="w-full max-w-xs md:max-w-sm bg-white rounded-xl shadow-md overflow-hidden aspect-square">
                    {loading ? (
                      <div className="w-full h-full animate-pulse bg-gray-200 rounded-xl flex items-center justify-center">
                        <span className="text-gray-400">Nalaganje...</span>
                      </div>
                    ) : imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt={getCurrentWord()} 
                        className="w-full h-full object-contain p-4"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        Ni slike
                      </div>
                    )}
                  </div>
                  
                  {/* Audio button */}
                  <Button 
                    onClick={handlePlayAudio}
                    size="lg"
                    className="bg-app-teal hover:bg-app-teal/90 text-white px-6 py-3 md:px-8 md:py-4 h-auto text-base md:text-lg rounded-full shadow-md hover:shadow-lg transform transition-transform hover:scale-105 mt-4"
                  >
                    <span className="mr-2">🎵</span>
                    Izgovori besedo
                  </Button>
                </div>
              </div>

              {/* Next button */}
              <Button 
                onClick={handleNext}
                size="icon"
                className="bg-app-blue hover:bg-app-blue/90 rounded-full h-14 w-14 md:h-16 md:w-16 shadow-md flex-shrink-0"
              >
                <ArrowRight className="h-6 w-6 md:h-7 md:w-7" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtikuacijskiTest;
