
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import { useArtikuacijskiTestSupabase } from "@/hooks/useArtikuacijskiTestSupabase";
import LetterSlider from "@/components/articulation/LetterSlider";
import WordDisplay from "@/components/articulation/WordDisplay";
import TestNavigation from "@/components/articulation/TestNavigation";
import Header from "@/components/Header";
import { PageHeader } from "@/components/PageHeader";
import { useIsMobile } from "@/hooks/use-mobile";

const ArtikuacijskiTest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const {
    currentLetter,
    setCurrentLetter,
    allLetters,
    loading,
    imageUrl,
    handleNext,
    handlePrevious,
    getCurrentWord,
    getCurrentWordInfo
  } = useArtikuacijskiTestSupabase();

  React.useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handlePlayAudio = () => {
    const word = getCurrentWord();
    if (word) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'sl-SI';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const wordInfo = getCurrentWordInfo();

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
        
        {/* Main content area - matching artikulacija layout */}
        <div className={`flex-grow flex items-center justify-center ${isMobile ? 'px-4 pb-4' : ''}`}>
          <div className="w-full max-w-md">
            <WordDisplay
              word={wordInfo.word}
              imageUrl={imageUrl}
              loading={loading}
              currentIndex={wordInfo.index - 1}
              totalWords={wordInfo.total}
              onPlayAudio={handlePlayAudio}
            />
          </div>
        </div>
        
        {/* Navigation controls */}
        <div className={`mt-8 ${isMobile ? 'px-4' : ''}`}>
          <TestNavigation
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        </div>
      </div>
    </div>
  );
};

export default ArtikuacijskiTest;
