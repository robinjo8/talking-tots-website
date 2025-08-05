import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { AppLayout } from "@/components/AppLayout";
import { MatchingGame } from '@/components/matching/MatchingGame';
import { getLetterData, getImagesForAgeGroup } from '@/data/matchingGameData';
import { getAgeGroup } from '@/utils/ageUtils';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, BookOpen } from 'lucide-react';

export default function MatchingGameLetter() {
  const { user, selectedChild } = useAuth();
  const navigate = useNavigate();
  const { letter } = useParams<{ letter: string }>();
  const isMobile = useIsMobile();
  const [gameKey, setGameKey] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const gameCompletedRef = useRef(false);

  // Check authentication
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Check age group access and get appropriate age group
  const childAge = selectedChild?.age || 3;
  const ageGroup = getAgeGroup(childAge);

  // Get letter data
  const upperCaseLetter = letter?.toUpperCase();
  const letterData = getLetterData(upperCaseLetter || '');
  
  if (!letterData || !upperCaseLetter) {
    return (
      <AppLayout>
        <div className="container max-w-5xl mx-auto pt-8 pb-20 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Napaka</h1>
            <p className="text-muted-foreground">Ni bilo mogoče naložiti podatkov za črko {upperCaseLetter}.</p>
            <Button 
              onClick={() => navigate('/govorne-igre')}
              className="mt-4"
            >
              Nazaj na igre
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Get age-appropriate images
  const images = getImagesForAgeGroup(letterData.images, ageGroup);

  // Determine number of columns based on age group
  const getColumnsForAge = (age: string) => {
    switch (age) {
      case '3-4': return 2;
      case '5-6': return 3;
      case '7-8': return 3;
      case '9-10': return 4;
      default: return 2;
    }
  };

  const numColumns = getColumnsForAge(ageGroup);

  // Handle game completion
  const handleGameComplete = (score: number) => {
    if (!gameCompletedRef.current) {
      gameCompletedRef.current = true;
      console.log(`Game completed with score: ${score}`);
      // Here you could save progress, show celebration, etc.
    }
  };

  const handleNewGame = () => {
    gameCompletedRef.current = false;
    setGameKey(prev => prev + 1);
  };

  const handleBack = () => {
    navigate(getBackPath());
  };

  const handleInstructions = () => {
    setShowInstructions(true);
  };

  // Fullscreen handling for mobile
  useEffect(() => {
    if (isMobile) {
      document.documentElement.requestFullscreen?.();
      return () => {
        if (document.fullscreenElement) {
          document.exitFullscreen?.();
        }
      };
    }
  }, [isMobile]);

  const effectiveFullscreen = isMobile;

  // Determine back navigation based on age group
  const getBackPath = () => {
    switch (ageGroup) {
      case '3-4': return '/govorne-igre/povezi-pare-3-4';
      case '5-6': return '/govorne-igre/povezi-pare-5-6';
      case '7-8': return '/govorne-igre/povezi-pare-7-8';
      case '9-10': return '/govorne-igre/povezi-pare-9-10';
      default: return '/govorne-igre/povezi-pare-3-4';
    }
  };

  if (effectiveFullscreen) {
    return (
      <div className="fixed inset-0 bg-background overflow-hidden select-none">
        <div className="h-full flex flex-col">
          {/* Top Section - Buttons */}
          <div className="bg-dragon-green/5 p-3 flex-shrink-0 border-b">
            <h2 className="text-lg font-bold mb-3 text-center">Igra ujemanja {upperCaseLetter}</h2>
            <div className="flex justify-center gap-3">
              <Button
                onClick={handleNewGame}
                size="sm"
                className="bg-dragon-green hover:bg-dragon-green/90 text-white gap-2"
                variant="default"
              >
                <RotateCcw className="h-4 w-4" />
                Nova igra
              </Button>
              
              <Button
                variant="outline"
                onClick={handleBack}
                size="sm"
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Nazaj
              </Button>
              
              <Button
                variant="outline"
                onClick={handleInstructions}
                size="sm"
                className="gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Navodila
              </Button>
            </div>
          </div>

          {/* Game Area with gray background */}
          <div className="flex-1 overflow-hidden bg-muted/30 p-4">
            <MatchingGame
              key={gameKey}
              images={images}
              numColumns={numColumns}
              onGameComplete={handleGameComplete}
              className="h-full"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="w-full min-h-screen bg-background">
        <div className="flex justify-center gap-4 p-4">
          <Button onClick={handleNewGame} variant="outline" className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Nova igra
          </Button>
          <Button onClick={handleInstructions} variant="outline" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Navodila
          </Button>
          <Button onClick={handleBack} variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Nazaj
          </Button>
        </div>
        
        <div className="w-full flex justify-center items-center p-4">
          <MatchingGame
            key={gameKey}
            images={images}
            numColumns={numColumns}
            onGameComplete={handleGameComplete}
          />
        </div>
      </div>
    </AppLayout>
  );
}