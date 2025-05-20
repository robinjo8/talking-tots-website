
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAudioPlayback } from "@/hooks/useAudioPlayback";
import { useIsMobile } from "@/hooks/use-mobile";
import { useArticulationTest } from "@/hooks/useArticulationTest";

// Import components
import LetterGrid from "@/components/articulation/LetterGrid";
import WordDisplay from "@/components/articulation/WordDisplay";
import TestNavigation from "@/components/articulation/TestNavigation";

const ArtikuacijskiTest = () => {
  const { selectedChildIndex, profile } = useAuth();
  const navigate = useNavigate();
  const { playAudio } = useAudioPlayback();
  const isMobile = useIsMobile();
  
  const selectedChild = selectedChildIndex !== null && profile?.children 
    ? profile.children[selectedChildIndex] 
    : null;

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
  } = useArticulationTest();
  
  const handlePlayAudio = () => {
    // This function will be implemented later when audio files are available
    console.log("No audio available for this word");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto pt-24 pb-20 px-4">
        <div className="mb-6 flex items-center">
          <Button 
            variant="ghost" 
            className="mr-4" 
            onClick={() => navigate('/moja-stran')}
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Nazaj
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold">
            Artikulacijski test
          </h1>
        </div>
        
        {/* Letter grid component */}
        <LetterGrid 
          letters={allLetters}
          currentLetter={currentLetter}
        />
        
        {/* Main content area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Left column (empty on mobile, visible on md+) */}
          <div className="hidden md:block md:col-span-1">
            {/* Placeholder for additional content if needed */}
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
          
          {/* Right column - Navigation */}
          <div className="md:col-span-1 flex justify-center mt-8 md:mt-0">
            <TestNavigation 
              onNext={handleNext} 
              onPrevious={handlePrevious} 
            />
          </div>
        </div>
        
        {/* Mobile navigation - only visible on small screens */}
        {isMobile && (
          <div className="flex justify-between mt-8 px-8">
            <Button 
              onClick={handlePrevious}
              variant="outline"
              size="icon"
              className="rounded-full h-14 w-14 border-2"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            
            <Button 
              onClick={handleNext}
              variant="outline"
              size="icon" 
              className="rounded-full h-14 w-14 border-2"
            >
              <ArrowRight className="h-6 w-6" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtikuacijskiTest;
