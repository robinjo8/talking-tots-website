
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import { useArticulationTest } from "@/hooks/useArticulationTest";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import LetterSlider from "@/components/articulation/LetterSlider";
import WordDisplay from "@/components/articulation/WordDisplay";
import TestNavigation from "@/components/articulation/TestNavigation";
import PracticeProgress from "@/components/articulation/PracticeProgress";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ArtikuacijskiTest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-gradient-to-br from-light-cloud to-white flex flex-col">
      {/* Header with back button */}
      <div className="absolute top-4 left-4 z-10">
        <Button
          onClick={() => navigate("/govorno-jezikovne-vaje")}
          variant="ghost"
          size="icon"
          className="rounded-full bg-white/80 hover:bg-white shadow-md"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-8 max-w-4xl mx-auto w-full">
        {/* Letter slider */}
        <div className="w-full mb-6">
          <LetterSlider
            letters={allLetters}
            currentLetter={currentLetter}
            onLetterChange={setCurrentLetter}
          />
        </div>

        {/* Progress indicators */}
        <div className="flex justify-center items-center gap-8 mb-8 text-sm font-medium text-gray-600">
          <span>Črka {currentLetterIndex + 1} od {totalLetters}</span>
          <span>Beseda {currentWordIndex} od {totalWordsPerLetter}</span>
        </div>

        {/* Word image display */}
        <div className="mb-8 w-full max-w-sm">
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
        <TestNavigation
          onNext={handleNext}
          onPrevious={handlePrevious}
        />

        {/* Overall progress */}
        <div className="w-full max-w-md mt-8">
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
