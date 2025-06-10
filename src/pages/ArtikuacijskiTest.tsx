
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

  // Calculate current word index within the letter group
  const currentWordIndex = overallIndex % 3 + 1; // Assuming 3 words per letter
  const totalWordsPerLetter = 3;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageHeader title="Artikulacijski Test" backPath="/govorno-jezikovne-vaje" />
      
      <div className="container max-w-5xl mx-auto px-4 flex flex-col justify-center min-h-[calc(100vh-160px)]">
        {/* Letter slider component */}
        <div className="w-full max-w-2xl mx-auto mb-8">
          <LetterSlider
            letters={allLetters}
            currentLetter={currentLetter}
            onLetterChange={setCurrentLetter}
          />
        </div>

        {/* Progress indicators */}
        <div className="flex justify-center items-center gap-8 mb-6 text-sm font-medium text-gray-600">
          <span>Črka {currentLetterIndex + 1} od {totalLetters}</span>
          <span>Beseda {currentWordIndex} od {totalWordsPerLetter}</span>
        </div>

        {/* Main content area with side navigation */}
        <div className="flex items-center justify-center gap-8 mb-8">
          {/* Previous button - positioned to the left */}
          <Button 
            onClick={handlePrevious}
            variant="outline"
            size="icon"
            className="rounded-full h-14 w-14 border-2 flex-shrink-0"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>

          {/* Word display - centered */}
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

          {/* Next button - positioned to the right */}
          <Button 
            onClick={handleNext}
            size="icon"
            className="bg-app-blue hover:bg-app-blue/90 rounded-full h-16 w-16 shadow-md flex-shrink-0"
          >
            <ArrowRight className="h-8 w-8" />
          </Button>
        </div>

        {/* Bottom navigation text */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Naslednja beseda</p>
        </div>
      </div>
    </div>
  );
};

export default ArtikuacijskiTest;
