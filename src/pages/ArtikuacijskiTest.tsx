
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import LetterSlider from "@/components/articulation/LetterSlider";
import { useArtikuacijskiTest } from "@/hooks/useArtikuacijskiTest";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const ArtikuacijskiTest = () => {
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
  } = useArtikuacijskiTest();

  const handleLetterChange = (letter: string) => {
    setCurrentLetter(letter);
  };

  // Calculate current letter index for progress display
  const currentLetterIndex = allLetters.indexOf(currentLetter);
  const progressPercentage = totalWords > 0 ? ((overallIndex + 1) / totalWords) * 100 : 0;

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
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Črka {currentLetterIndex + 1} od {allLetters.length}
            </p>
            {totalWords > 0 && (
              <>
                <Progress value={progressPercentage} className="w-48 mx-auto" />
                <p className="text-xs text-muted-foreground">
                  Beseda {overallIndex + 1} od {totalWords}
                </p>
              </>
            )}
          </div>
        </div>
        
        {/* Main content area */}
        <div className={`flex-grow flex items-center justify-center ${isMobile ? 'px-4 pb-4' : ''}`}>
          <div className="text-center space-y-6 max-w-md w-full">
            {/* Selected letter display */}
            <div className="w-32 h-32 mx-auto bg-app-purple rounded-full flex items-center justify-center shadow-lg">
              <span className="text-6xl font-bold text-white">{currentLetter}</span>
            </div>
            
            {/* Letter name */}
            <h2 className="text-3xl font-bold text-foreground">
              Črka {currentLetter}
            </h2>
            
            {/* Word and image display */}
            {loading ? (
              <Card className="p-6">
                <div className="animate-pulse">
                  <div className="w-48 h-48 bg-gray-200 rounded-lg mx-auto mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-32 mx-auto"></div>
                </div>
              </Card>
            ) : (
              <Card className="p-6 shadow-md border">
                <CardContent className="space-y-4 p-0">
                  {imageUrl && (
                    <div className="w-48 h-48 mx-auto overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
                      <img 
                        src={imageUrl} 
                        alt={getCurrentWord()}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          console.error("Image failed to load:", imageUrl);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <h3 className="text-2xl font-bold text-center text-foreground">
                    {getCurrentWord()}
                  </h3>
                </CardContent>
              </Card>
            )}
            
            {/* Navigation controls */}
            <div className="flex justify-center gap-4 pt-4">
              <Button 
                variant="outline" 
                size="lg"
                onClick={handlePrevious}
                disabled={loading}
                className="gap-2"
              >
                <ArrowLeft className="h-5 w-5" />
                Prejšnja
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => {
                  setCurrentLetter(allLetters[0]);
                }}
                disabled={loading}
                className="gap-2"
              >
                <RotateCcw className="h-5 w-5" />
                Znova
              </Button>
              
              <Button 
                size="lg"
                onClick={handleNext}
                disabled={loading}
                className="gap-2"
              >
                Naslednja
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtikuacijskiTest;
