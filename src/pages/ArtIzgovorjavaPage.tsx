import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import LetterSlider from "@/components/articulation/LetterSlider";

const ArtIzgovorjavaPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // All Slovenian alphabet letters
  const allLetters = ['A', 'B', 'C', 'Č', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'Š', 'T', 'U', 'V', 'Z', 'Ž'];
  const [currentLetter, setCurrentLetter] = useState(allLetters[0]);

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
            Artikulacija
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
              Artikulacija
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
            
            {/* Placeholder content */}
            <div className="bg-background/80 backdrop-blur-sm rounded-xl p-6 shadow-md border max-w-md">
              <p className="text-muted-foreground text-center">
                Vsebina za črko {currentLetter} bo dodana kmalu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtIzgovorjavaPage;
