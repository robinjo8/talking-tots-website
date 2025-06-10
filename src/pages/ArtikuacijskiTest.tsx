
import { useState } from "react";
import Header from "@/components/Header";
import { PageHeader } from "@/components/PageHeader";
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
      <PageHeader title="Artikulacijski test" backPath="/moja-stran" />
      
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
        <div className={`flex justify-center ${isMobile ? 'px-4 mb-4' : 'mb-6'}`}>
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground">
              Črka {currentLetterIndex + 1} od {allLetters.length}
            </p>
          </div>
        </div>
        
        {/* Main content area */}
        <div className={`flex-grow flex items-center justify-center ${isMobile ? 'px-4 pb-4' : ''}`}>
          <div className="text-center space-y-6">
            {/* Selected letter display */}
            <div className="w-32 h-32 mx-auto bg-app-purple rounded-full flex items-center justify-center shadow-lg">
              <span className="text-6xl font-bold text-white">{currentLetter}</span>
            </div>
            
            {/* Letter name */}
            <h2 className="text-3xl font-bold text-foreground">
              Črka {currentLetter}
            </h2>
            
            {/* Image and word content */}
            <div className="bg-background/80 backdrop-blur-sm rounded-xl p-8 shadow-md border max-w-md mx-auto">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app-purple"></div>
                </div>
              ) : imageError ? (
                <div className="space-y-6">
                  {/* Error state with placeholder */}
                  <div className="w-full h-48 flex items-center justify-center bg-muted rounded-lg border-2 border-dashed border-muted-foreground/30">
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
                  
                  {/* Word label */}
                  <h3 className="text-2xl font-bold text-app-purple uppercase tracking-wide">
                    {getCurrentWord()}
                  </h3>
                  
                  {/* Navigation controls */}
                  <div className="flex justify-between items-center mt-6">
                    <Button
                      onClick={handlePrevious}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Prejšnja
                    </Button>
                    
                    <span className="text-sm text-muted-foreground">
                      {overallIndex + 1} / {totalWords}
                    </span>
                    
                    <Button
                      onClick={handleNext}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      Naslednja
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                    </Button>
                  </div>
                </div>
              ) : imageUrl ? (
                <div className="space-y-6">
                  {/* Image display */}
                  <div className="w-full h-48 flex items-center justify-center">
                    <img 
                      src={imageUrl} 
                      alt={getCurrentWord()}
                      className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                      onError={(e) => {
                        console.error("Error loading image:", e);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  
                  {/* Word label */}
                  <h3 className="text-2xl font-bold text-app-purple uppercase tracking-wide">
                    {getCurrentWord()}
                  </h3>
                  
                  {/* Navigation controls */}
                  <div className="flex justify-between items-center mt-6">
                    <Button
                      onClick={handlePrevious}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Prejšnja
                    </Button>
                    
                    <span className="text-sm text-muted-foreground">
                      {overallIndex + 1} / {totalWords}
                    </span>
                    
                    <Button
                      onClick={handleNext}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      Naslednja
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center h-64 flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Ni podatkov za črko {currentLetter}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtikuacijskiTest;
