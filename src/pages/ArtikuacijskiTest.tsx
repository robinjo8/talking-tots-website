
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
      
      {/* Main container with proper spacing and responsive layout */}
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8">
        {/* Letter slider - with proper overflow handling */}
        <div className="w-full mb-6 md:mb-8 overflow-x-auto">
          <div className="min-w-full">
            <LetterSlider
              letters={allLetters}
              currentLetter={currentLetter}
              onLetterChange={setCurrentLetter}
            />
          </div>
        </div>

        {/* Main content area - responsive layout with proper centering */}
        <div className="flex items-center justify-center min-h-[400px] md:min-h-[500px] px-2 sm:px-4">
          <div className="w-full max-w-5xl mx-auto">
            {/* Mobile layout - stacked */}
            {isMobile ? (
              <div className="flex flex-col items-center space-y-6">
                {/* Word display with updated progress layout */}
                <div className="w-full max-w-sm">
                  <div className="flex flex-col items-center w-full">
                    {/* Word title */}
                    <h2 className="text-3xl font-bold text-app-purple mb-3">
                      {getCurrentWord()}
                    </h2>
                    
                    {/* Combined progress indicators on same row */}
                    <div className="flex items-center justify-center gap-4 mb-4 text-sm text-muted-foreground">
                      <span>Črka {currentLetterIndex + 1} od {totalLetters}</span>
                      <span>•</span>
                      <span>Beseda {overallIndex + 1} od {totalWords}</span>
                    </div>
                    
                    {/* Image container */}
                    <div className="w-full bg-white rounded-xl shadow-md overflow-hidden mb-6 aspect-square">
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
                      className="bg-app-teal hover:bg-app-teal/90 text-white px-8 py-6 h-auto text-lg rounded-full shadow-md hover:shadow-lg transform transition-transform hover:scale-105 mb-6"
                    >
                      <span className="mr-2">🎵</span>
                      Izgovori besedo
                    </Button>
                  </div>
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
              /* Desktop layout - side by side with proper spacing */
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

                {/* Word display - centered with updated layout */}
                <div className="flex-1 max-w-md lg:max-w-lg">
                  <div className="flex flex-col items-center w-full">
                    {/* Word title */}
                    <h2 className="text-3xl lg:text-4xl font-bold text-app-purple mb-3">
                      {getCurrentWord()}
                    </h2>
                    
                    {/* Combined progress indicators on same row */}
                    <div className="flex items-center justify-center gap-4 mb-4 text-sm lg:text-base text-muted-foreground">
                      <span>Črka {currentLetterIndex + 1} od {totalLetters}</span>
                      <span>•</span>
                      <span>Beseda {overallIndex + 1} od {totalWords}</span>
                    </div>
                    
                    {/* Image container */}
                    <div className="w-full bg-white rounded-xl shadow-md overflow-hidden mb-6 aspect-square">
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
                      className="bg-app-teal hover:bg-app-teal/90 text-white px-8 py-6 h-auto text-lg rounded-full shadow-md hover:shadow-lg transform transition-transform hover:scale-105"
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
