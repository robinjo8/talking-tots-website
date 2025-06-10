
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
      
      <div className="container max-w-5xl mx-auto pt-8 pb-20 px-4">
        {/* Letter slider component */}
        <div className={isMobile ? 'px-4' : ''}>
          <LetterSlider
            letters={allLetters}
            currentLetter={currentLetter}
            onLetterChange={setCurrentLetter}
          />
        </div>
        
        {/* Progress display - same style as artikulacija page */}
        <div className={`flex justify-center ${isMobile ? 'px-4 mb-6' : 'mb-8'}`}>
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-3 text-sm md:text-base text-muted-foreground">
              <span>Črka {currentLetterIndex + 1} od {totalLetters}</span>
              <span>•</span>
              <span>Beseda {overallIndex + 1} od {totalWords}</span>
            </div>
          </div>
        </div>
        
        {/* Main content area - using flex-grow for proper centering like artikulacija page */}
        <div className={`flex-grow flex items-center justify-center ${isMobile ? 'px-4 pb-4' : ''}`}>
          <div className="text-center space-y-6 w-full max-w-md mx-auto">
            {/* Word title */}
            <h2 className="text-3xl md:text-4xl font-bold text-app-purple">
              {getCurrentWord()}
            </h2>
            
            {/* Image container with consistent sizing */}
            <div className="w-full max-w-xs md:max-w-sm mx-auto bg-white rounded-xl shadow-lg overflow-hidden aspect-square">
              {loading ? (
                <div className="w-full h-full animate-pulse bg-gray-200 rounded-xl flex items-center justify-center">
                  <span className="text-gray-400">Nalaganje...</span>
                </div>
              ) : imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={getCurrentWord()} 
                  className="w-full h-full object-contain p-6"
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
              className="bg-app-teal hover:bg-app-teal/90 text-white px-8 py-4 h-auto text-lg rounded-full shadow-md hover:shadow-lg transform transition-transform hover:scale-105"
            >
              <span className="mr-2">🎵</span>
              Izgovori besedo
            </Button>
          </div>
        </div>

        {/* Navigation arrows - positioned at bottom like artikulacija page pattern */}
        <div className="flex items-center justify-center gap-8 mt-8">
          <Button 
            onClick={handlePrevious}
            variant="outline"
            size="icon"
            className="rounded-full h-14 w-14 border-2 shadow-md hover:shadow-lg transition-all"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>

          <Button 
            onClick={handleNext}
            size="icon"
            className="bg-app-blue hover:bg-app-blue/90 rounded-full h-16 w-16 shadow-md hover:shadow-lg transition-all"
          >
            <ArrowRight className="h-7 w-7" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArtikuacijskiTest;
