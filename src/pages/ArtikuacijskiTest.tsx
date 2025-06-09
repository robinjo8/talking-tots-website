
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import { useIsMobile } from "@/hooks/use-mobile";
import { useArticulationTest } from "@/hooks/useArticulationTest";

// Import components
import LetterSlider from "@/components/articulation/LetterSlider";
import WordDisplay from "@/components/articulation/WordDisplay";

const ArtikuacijskiTest = () => {
  const navigate = useNavigate();
  const {
    playAudio
  } = useAudioPlayback();
  const isMobile = useIsMobile();
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

  const handlePlayAudio = () => {
    // This function will be implemented later when audio files are available
    console.log("No audio available for this word");
  };

  const handleLetterChange = (letter: string) => {
    setCurrentLetter(letter);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-5xl mx-auto pt-32 pb-20 px-4">
        <div className="flex items-center gap-3 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2" 
            onClick={() => navigate("/moja-stran")}
          >
            <ArrowLeft className="h-4 w-4" />
            Nazaj
          </Button>
          
          <h1 className="text-2xl font-bold text-foreground">
            Artikulacijski test
          </h1>
        </div>
        
        {/* Letter slider component */}
        <LetterSlider 
          letters={allLetters} 
          currentLetter={currentLetter} 
          onLetterChange={handleLetterChange}
        />
        
        {/* Main content - different layout for mobile vs desktop */}
        <div className="flex-grow flex items-center justify-center">
          {isMobile ? (
            /* Mobile layout: Navigation buttons on sides of the image */
            <div className="relative w-full max-w-md mx-auto">
              {/* Left arrow (previous) */}
              <Button 
                onClick={handlePrevious}
                variant="outline" 
                size="icon" 
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/4 rounded-full h-14 w-14 border-2 shadow-md z-10"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              
              {/* Center content */}
              <div className="px-12">
                <WordDisplay 
                  word={getCurrentWord()} 
                  imageUrl={imageUrl} 
                  loading={loading} 
                  currentIndex={overallIndex} 
                  totalWords={totalWords} 
                  onPlayAudio={handlePlayAudio} 
                />
              </div>
              
              {/* Right arrow (next) */}
              <Button 
                onClick={handleNext}
                size="icon" 
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 rounded-full h-14 w-14 border-2 bg-app-blue text-white hover:bg-app-blue/90 shadow-md z-10"
              >
                <ArrowLeft className="h-6 w-6 rotate-180" />
              </Button>
            </div>
          ) : (
            /* Desktop layout */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center w-full max-w-5xl mx-auto">
              {/* Left column - Previous button */}
              <div className="hidden md:flex md:justify-end">
                <Button 
                  onClick={handlePrevious}
                  variant="outline" 
                  size="icon" 
                  className="rounded-full h-14 w-14 border-2 shadow-md"
                >
                  <ArrowLeft className="h-6 w-6" />
                </Button>
              </div>
              
              {/* Center column - Word and Image */}
              <div className="md:col-span-1">
                <WordDisplay 
                  word={getCurrentWord()} 
                  imageUrl={imageUrl} 
                  loading={loading} 
                  currentIndex={overallIndex} 
                  totalWords={totalWords} 
                  onPlayAudio={handlePlayAudio} 
                />
              </div>
              
              {/* Right column - Next button */}
              <div className="hidden md:flex md:justify-start">
                <Button 
                  onClick={handleNext}
                  size="icon" 
                  className="rounded-full h-14 w-14 bg-app-blue hover:bg-app-blue/90 text-white shadow-md"
                >
                  <ArrowLeft className="h-6 w-6 rotate-180" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtikuacijskiTest;
