
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import { useArticulationTest } from "@/hooks/useArticulationTest";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import LetterSlider from "@/components/articulation/LetterSlider";
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
        
        {/* Progress display */}
        <div className={`flex justify-center ${isMobile ? 'px-4 mb-4' : 'mb-6'}`}>
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">
              Črka {currentLetterIndex + 1} od {totalLetters}
            </p>
          </div>
        </div>
        
        {/* Main content area - matching artikulacija layout */}
        <div className={`flex-grow flex items-center justify-center ${isMobile ? 'px-4 pb-4' : ''}`}>
          <div className="text-center space-y-6">
            {/* Word display in large purple circle like artikulacija */}
            <div className="w-32 h-32 mx-auto bg-app-purple rounded-full flex items-center justify-center shadow-lg">
              <span className="text-6xl font-bold text-white">{getCurrentWord()}</span>
            </div>
            
            {/* Word name */}
            <h2 className="text-3xl font-bold text-foreground">
              Beseda {getCurrentWord()}
            </h2>
            
            {/* Image and content container */}
            <div className="bg-background/80 backdrop-blur-sm rounded-xl p-6 shadow-md border max-w-md">
              {/* Image container */}
              <div className="w-full max-w-xs mx-auto bg-white rounded-xl shadow-lg overflow-hidden aspect-square mb-4">
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
              
              {/* Progress info */}
              <p className="text-sm text-muted-foreground text-center mb-4">
                Beseda {overallIndex + 1} od {totalWords}
              </p>
              
              {/* Audio button */}
              <Button 
                onClick={handlePlayAudio}
                size="lg"
                className="w-full bg-app-teal hover:bg-app-teal/90 text-white px-8 py-4 h-auto text-lg rounded-full shadow-md hover:shadow-lg transform transition-transform hover:scale-105"
              >
                <span className="mr-2">🎵</span>
                Izgovori besedo
              </Button>
            </div>
            
            {/* Navigation arrows */}
            <div className="flex items-center justify-center gap-8 mt-6">
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
      </div>
    </div>
  );
};

export default ArtikuacijskiTest;
