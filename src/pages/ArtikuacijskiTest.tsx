
import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import LetterSlider from "@/components/articulation/LetterSlider";
import { useArtikuacijskiTest } from "@/hooks/useArtikuacijskiTest";

const ArtikuacijskiTest = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const {
    imageUrl,
    loading,
    imageError,
    currentLetter,
    allLetters,
    overallIndex,
    totalWords,
    handleNext,
    handlePrevious,
    getCurrentWord,
    setCurrentLetter
  } = useArtikuacijskiTest();

  const handleLetterChange = (letter: string) => {
    setCurrentLetter(letter);
  };

  // Calculate current letter index for progress display
  const currentLetterIndex = allLetters.indexOf(currentLetter);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-5xl mx-auto pt-8 pb-20 px-4">
        {/* Back button and title - only visible on desktop */}
        <div className="hidden lg:flex items-center gap-3 mb-8">
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

        {/* Mobile back button - positioned at top */}
        {isMobile && (
          <div className="flex items-center justify-between p-4 bg-background/95 backdrop-blur-sm">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2" 
              onClick={() => navigate("/moja-stran")}
            >
              <ArrowLeft className="h-4 w-4" />
              Nazaj
            </Button>
            <h1 className="text-lg font-bold text-foreground">
              Artikulacijski test
            </h1>
            <div className="w-16"></div> {/* Spacer for centering */}
          </div>
        )}
        
        {/* Letter slider component */}
        <div className={isMobile ? 'px-4' : ''}>
          <LetterSlider 
            letters={allLetters} 
            currentLetter={currentLetter} 
            onLetterChange={handleLetterChange}
          />
        </div>
        
        {/* Progress display */}
        <div className={`flex justify-center ${isMobile ? 'px-4 mb-8' : 'mb-8'}`}>
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Črka {currentLetterIndex + 1} od {allLetters.length}
            </p>
            <p className="text-xs text-muted-foreground">
              Beseda {overallIndex + 1} od {totalWords}
            </p>
          </div>
        </div>
        
        {/* New content area - clean design like PIPA example */}
        <div className="max-w-md mx-auto text-center space-y-8">
          {/* Word display */}
          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-app-purple tracking-wider">
              {getCurrentWord().toUpperCase()}
            </h2>
          </div>
          
          {/* Image display */}
          <div className="w-full">
            {loading ? (
              <div className="w-full h-64 flex items-center justify-center bg-muted rounded-xl">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app-purple"></div>
              </div>
            ) : imageError ? (
              <div className="w-full h-64 flex items-center justify-center bg-muted rounded-xl border-2 border-dashed border-muted-foreground/30">
                <div className="text-center space-y-3">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground/50" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      Slika ni na voljo
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      {imageError}
                    </p>
                  </div>
                </div>
              </div>
            ) : imageUrl ? (
              <div className="w-full h-64 flex items-center justify-center">
                <img 
                  src={imageUrl} 
                  alt={getCurrentWord()}
                  className="max-w-full max-h-full object-contain rounded-xl"
                  onError={(e) => {
                    console.error("Error loading image:", e);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className="w-full h-64 flex items-center justify-center bg-muted rounded-xl">
                <p className="text-muted-foreground">
                  Ni podatkov za črko {currentLetter}
                </p>
              </div>
            )}
          </div>
          
          {/* Navigation controls */}
          <div className="flex justify-between items-center pt-6">
            <Button
              onClick={handlePrevious}
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {overallIndex + 1} / {totalWords}
              </p>
            </div>
            
            <Button
              onClick={handleNext}
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full"
            >
              <ArrowLeft className="h-5 w-5 rotate-180" />
            </Button>
          </div>
          
          {/* Speech recording button placeholder */}
          <div className="pt-4">
            <Button 
              className="bg-app-teal hover:bg-app-teal/90 text-white px-8 py-3 rounded-full text-lg font-medium"
              size="lg"
            >
              🎤 Izgovori besedo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtikuacijskiTest;
