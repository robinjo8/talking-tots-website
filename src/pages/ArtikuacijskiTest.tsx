
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import { useArticulationTest } from "@/hooks/useArticulationTest";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import LetterSlider from "@/components/articulation/LetterSlider";
import WordDisplay from "@/components/articulation/WordDisplay";
import TestNavigation from "@/components/articulation/TestNavigation";
import PracticeProgress from "@/components/articulation/PracticeProgress";
import Header from "@/components/Header";
import { PageHeader } from "@/components/PageHeader";
import { useIsMobile } from "@/hooks/use-mobile";

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
      
      <div className="container max-w-5xl mx-auto pt-8 pb-20 px-4">
        {/* Letter slider component */}
        <div className={isMobile ? 'px-4' : ''}>
          <LetterSlider
            letters={allLetters}
            currentLetter={currentLetter}
            onLetterChange={setCurrentLetter}
          />
        </div>

        {/* Progress indicators */}
        <div className={`flex justify-center items-center gap-8 ${isMobile ? 'px-4 mb-4' : 'mb-6'} text-sm font-medium text-gray-600`}>
          <span>Črka {currentLetterIndex + 1} od {totalLetters}</span>
          <span>Beseda {currentWordIndex} od {totalWordsPerLetter}</span>
        </div>

        {/* Word image display */}
        <div className={`${isMobile ? 'px-4 mb-6' : 'mb-8'} w-full max-w-sm mx-auto`}>
          <WordDisplay
            word={getCurrentWord()}
            imageUrl={imageUrl}
            loading={loading}
            currentIndex={overallIndex}
            totalWords={totalWords}
            onPlayAudio={handlePlayAudio}
          />
        </div>

        {/* Navigation controls */}
        <div className={`flex justify-center ${isMobile ? 'px-4 mb-6' : 'mb-8'}`}>
          <TestNavigation
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        </div>

        {/* Overall progress */}
        <div className={`w-full max-w-md mx-auto ${isMobile ? 'px-4' : ''}`}>
          <PracticeProgress
            currentWordIndex={overallIndex}
            totalWords={totalWords}
            progress={(overallIndex + 1) / totalWords * 100}
          />
        </div>
      </div>
    </div>
  );
};

export default ArtikuacijskiTest;
