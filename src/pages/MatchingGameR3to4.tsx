import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';
import { MatchingGame } from '@/components/matching/MatchingGame';
import { getLetterData, getImagesForAgeGroup } from '@/data/matchingGameData';
import { getAgeGroup } from '@/utils/ageUtils';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function MatchingGameR3to4() {
  const { user, selectedChild } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Check authentication
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Check age group access
  const childAge = selectedChild?.age || 3;
  const ageGroup = getAgeGroup(childAge);

  if (ageGroup !== '3-4') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-5xl mx-auto pt-28 md:pt-32 pb-20 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Dostop omejen</h1>
            <p className="text-muted-foreground">
              Ta igra je namenjena otrokom starosti 3-4 leta.
            </p>
            <Button 
              onClick={() => navigate('/govorne-igre')}
              className="mt-4"
            >
              Nazaj na igre
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Get letter data
  const letterData = getLetterData('R');
  if (!letterData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-5xl mx-auto pt-28 md:pt-32 pb-20 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Napaka</h1>
            <p className="text-muted-foreground">Ni bilo mogoče naložiti podatkov za črko R.</p>
          </div>
        </div>
      </div>
    );
  }

  // Get age-appropriate images
  const images = getImagesForAgeGroup(letterData.images, ageGroup);

  // Handle game completion
  const handleGameComplete = (score: number) => {
    console.log(`Game completed with score: ${score}`);
    // Here you could save progress, show celebration, etc.
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

  return (
    <div className="min-h-screen bg-background">
      {!effectiveFullscreen && <Header />}
      
      <div className={`container max-w-7xl mx-auto ${effectiveFullscreen ? 'pt-4' : 'pt-28 md:pt-32'} pb-8 px-4`}>
        {/* Back button */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/govorne-igre/povezi-pare-3-4')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Nazaj na izbiro črk
          </Button>
        </div>

        {/* Game header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 text-foreground">
            Poveži pare - Črka R
          </h1>
          <p className="text-muted-foreground">
            {selectedChild?.name ? `${selectedChild.name}, ` : ''}
            poveži enake slike med stolpci!
          </p>
        </div>

        {/* Matching Game */}
        <MatchingGame
          images={images}
          numColumns={2} // For 3-4 age group, use 2 columns
          onGameComplete={handleGameComplete}
          className="mb-8"
        />
      </div>
    </div>
  );
}