
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import { useArticulationTest } from "@/hooks/useArticulationTest";
import LetterSlider from "@/components/articulation/LetterSlider";
import Header from "@/components/Header";
import { PageHeader } from "@/components/PageHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";

const ArtikuacijskiTest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
        
        {/* Main content area - exactly like artikulacija */}
        <div className={`flex-grow flex items-center justify-center ${isMobile ? 'px-4 pb-4' : ''}`}>
          <div className="text-center space-y-6">
            {/* Word display in large purple circle like artikulacija */}
            <div className="w-32 h-32 mx-auto bg-app-purple rounded-full flex items-center justify-center shadow-lg">
              <span className="text-6xl font-bold text-white">{getCurrentWord()}</span>
            </div>
            
            {/* Word name - simple like artikulacija */}
            <h2 className="text-3xl font-bold text-foreground">
              Beseda {getCurrentWord()}
            </h2>
            
            {/* Simple content card - matching artikulacija style */}
            <div className="bg-background/80 backdrop-blur-sm rounded-xl p-6 shadow-md border max-w-md">
              <p className="text-muted-foreground text-center mb-4">
                Beseda {overallIndex + 1} od {totalWords}
              </p>
              
              {/* Minimal controls row */}
              <div className="flex items-center justify-center gap-4">
                <Button 
                  onClick={handlePrevious}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                
                <Button 
                  onClick={handlePlayAudio}
                  variant="outline"
                  size="sm"
                  className="gap-1 px-3"
                >
                  <Play className="h-3 w-3" />
                  Predvajaj
                </Button>

                <Button 
                  onClick={handleNext}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtikuacijskiTest;
