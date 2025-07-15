import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { SequentialCard } from "@/components/exercises/SequentialCard";
import { ExerciseModal } from "@/components/exercises/ExerciseModal";
import { ProgressTracker } from "@/components/exercises/ProgressTracker";
import { useExerciseProgress } from "@/hooks/useExerciseProgress";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const VajeMoториkeGovoril = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [cacheVersion, setCacheVersion] = useState(Date.now());
  
  // Force browser to recognize this as new version - v2.0
  const pageVersion = "v2.0-" + Date.now();
  
  const {
    progress,
    completeCard,
    resetProgress,
    isCardLocked,
    isCardCompleted,
    isCardActive,
  } = useExerciseProgress();

  // Clear caches on component mount
  useEffect(() => {
    const clearCaches = () => {
      // Clear localStorage items related to caching
      Object.keys(localStorage).forEach(key => {
        if (key.includes('cache') || key.includes('vaje-motorike')) {
          localStorage.removeItem(key);
        }
      });
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      // Force service worker to update if available
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
          registrations.forEach(registration => {
            registration.update();
          });
        });
      }
    };
    
    clearCaches();
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleForceRefresh = () => {
    setCacheVersion(Date.now());
    // Force hard refresh on mobile
    if (window.location.reload) {
      window.location.reload();
    } else {
      window.location.href = window.location.href;
    }
  };

  const supabaseUrl = "https://ecmtctwovkheohqwahvt.supabase.co";
  const bucketName = "slike-vaje-motorike-govoril";

  const instructions = [
    "NASMEHNI SE.",
    "NASMEHNI SE IN POKAŽI ZOBE.",
    "NAREDI ŠOBO.",
    "NAREDI ŠOBO IN POKAŽI ZOBE.",
    "ODPRI USTA.",
    "PREMIKAJ JEZIK PO ZGORNJI USTNICI.",
    "PREMIKAJ JEZIK PO SPODNJI USTNICI.",
    "PREMIKAJ JEZIK PO ZGORNJIH ZOBEH.",
    "PREMIKAJ JEZIK ZA ZGORNJIMI ZOBMI.",
    "PREMIKAJ JEZIK PO SPODNJIH ZOBEH.",
    "PREMIKAJ JEZIK ZA SPODNJIMI ZOBMI.",
    "Z JEZIKOM SE DOTAKNI NOSU.",
    "Z JEZIKOM SE DOTAKNI BRADE.",
    "PREMAKNI JEZIK V LEVO.",
    "PREMAKNI JEZIK V DESNO.",
    "ZGORNJO USTNICO DAJ ČEZ SPODNJO.",
    "SPODNJO USTNICO DAJ ČEZ ZGORNJO.",
    "SKRIJ OBE USTNICI.",
    "UGRIZNI SPODNJO USTNICO.",
    "UGRIZNI ZGORNJO USTNICO.",
    "POKAŽI JEZIK.",
    "Z JEZIKOM SE DOTAKNI TRDEGA NEBA.",
    "NAPIHNI LICA.",
    "NAPIHNI LEVO LICE.",
    "NAPIHNI DESNO LICE.",
    "IZDIHNI ZRAK IZ UST.",
    "VDIHNI ZRAK V USTA.",
  ];

  const handleCardClick = (cardNumber: number) => {
    if (isCardLocked(cardNumber)) return;
    setSelectedCard(cardNumber);
  };

  const handleCloseModal = () => {
    if (selectedCard) {
      completeCard(selectedCard);
    }
    setSelectedCard(null);
  };

  const handleCompleteCard = () => {
    if (selectedCard) {
      completeCard(selectedCard);
    }
  };

  // Create grid of 27 cards (6 rows x 5 columns, last row has 2 cards)
  const cards = Array.from({ length: 27 }, (_, index) => index + 1);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-6xl mx-auto pt-20 md:pt-24 pb-20 px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Vaje motorike govoril
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Vaje motorike govoril so namenjene razgibavanju govoril – ust, ustnic in jezika. 
            Začnite z vajo št. 1 in nadaljujte po vrsti.
          </p>
          {/* Debug indicator - NEW VERSION */}
          <div className="mt-2 text-xs text-green-600 font-mono">
            ✅ Nova verzija: {pageVersion}
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          <ProgressTracker
            currentCard={progress.currentUnlockedCard}
            totalCards={27}
            completedCount={progress.completedCards.length}
            onReset={resetProgress}
          />
          
          {/* Force Refresh Button for Mobile Cache Issues */}
          <div className="text-center">
            <Button
              onClick={handleForceRefresh}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Osveži stran
            </Button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4 max-w-4xl mx-auto">
          {cards.map((cardNumber) => (
            <SequentialCard
              key={cardNumber}
              number={cardNumber}
              isLocked={isCardLocked(cardNumber)}
              isCompleted={isCardCompleted(cardNumber)}
              isActive={isCardActive(cardNumber)}
              onClick={() => handleCardClick(cardNumber)}
            />
          ))}
        </div>

        {/* Exercise Modal */}
        {selectedCard && (
          <ExerciseModal
            isOpen={true}
            onClose={handleCloseModal}
            cardNumber={selectedCard}
            instruction={instructions[selectedCard - 1]}
            imageUrl={`${supabaseUrl}/storage/v1/object/public/${bucketName}/${selectedCard}.jpg?v=${cacheVersion}&t=${Date.now()}`}
            audioUrl={`${supabaseUrl}/storage/v1/object/public/${bucketName}/${selectedCard}.m4a?v=${cacheVersion}&t=${Date.now()}`}
            onComplete={handleCompleteCard}
          />
        )}
      </div>
    </div>
  );
};

export default VajeMoториkeGovoril;