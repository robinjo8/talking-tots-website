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
  const [cacheCleared, setCacheCleared] = useState(false);
  
  // EMERGENCY: Force complete cache invalidation - v3.0
  const pageVersion = "v3.0-EMERGENCY-" + Date.now();
  const emergencyCacheBuster = `?emergency=${Date.now()}&v=3.0&mobile=${navigator.userAgent.includes('Mobile')}`;
  
  const {
    progress,
    completeCard,
    resetProgress,
    isCardLocked,
    isCardCompleted,
    isCardActive,
  } = useExerciseProgress();

  // EMERGENCY: Aggressive cache clearing on component mount
  useEffect(() => {
    const aggressiveCacheClear = async () => {
      try {
        // 1. Clear ALL localStorage and sessionStorage
        localStorage.clear();
        sessionStorage.clear();
        
        // 2. Unregister ALL service workers
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(registrations.map(registration => registration.unregister()));
        }
        
        // 3. Clear all caches API
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map(name => caches.delete(name)));
        }
        
        // 4. Force browser cache clear with meta refresh
        const metaRefresh = document.createElement('meta');
        metaRefresh.httpEquiv = 'Cache-Control';
        metaRefresh.content = 'no-cache, no-store, must-revalidate, max-age=0';
        document.head.appendChild(metaRefresh);
        
        // 5. Add mobile-specific cache prevention
        if (navigator.userAgent.includes('Mobile')) {
          const mobileMeta = document.createElement('meta');
          mobileMeta.name = 'cache-control';
          mobileMeta.content = 'no-store';
          document.head.appendChild(mobileMeta);
        }
        
        setCacheCleared(true);
        console.log('✅ EMERGENCY: All caches cleared successfully');
      } catch (error) {
        console.error('❌ Cache clearing failed:', error);
      }
    };
    
    aggressiveCacheClear();
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleForceRefresh = () => {
    setCacheVersion(Date.now());
    // EMERGENCY: Nuclear option for mobile cache
    window.location.href = window.location.href.split('?')[0] + `?force=${Date.now()}&emergency=true`;
  };
  
  const handleEmergencyReload = () => {
    // Change URL to bypass cache completely
    window.location.href = '/govorno-jezikovne-vaje/vaje-motorike-govoril-v2' + emergencyCacheBuster;
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
          {/* EMERGENCY DEBUG INDICATOR */}
          <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-xs">
            <div className="text-red-600 font-mono font-bold">
              🚨 EMERGENCY VERSION: {pageVersion}
            </div>
            <div className="text-red-500 mt-1">
              Cache Status: {cacheCleared ? '✅ Cleared' : '⏳ Clearing...'}
            </div>
            <div className="text-red-500">
              Mobile: {navigator.userAgent.includes('Mobile') ? 'YES' : 'NO'}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          <ProgressTracker
            currentCard={progress.currentUnlockedCard}
            totalCards={27}
            completedCount={progress.completedCards.length}
            onReset={resetProgress}
          />
          
          {/* EMERGENCY CACHE BUSTING CONTROLS */}
          <div className="text-center space-y-2">
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                onClick={handleForceRefresh}
                variant="destructive"
                size="sm"
                className="text-xs"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                🚨 Osveži stran
              </Button>
              <Button
                onClick={handleEmergencyReload}
                variant="outline"
                size="sm"
                className="text-xs border-red-300 text-red-600"
              >
                🆘 Emergenčni reload
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              Če še vedno vidite staro različico, uporabite emergenčni reload
            </div>
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
            imageUrl={`${supabaseUrl}/storage/v1/object/public/${bucketName}/${selectedCard}.jpg${emergencyCacheBuster}&img=${Date.now()}`}
            audioUrl={`${supabaseUrl}/storage/v1/object/public/${bucketName}/${selectedCard}.m4a${emergencyCacheBuster}&audio=${Date.now()}`}
            onComplete={handleCompleteCard}
          />
        )}
      </div>
    </div>
  );
};

export default VajeMoториkeGovoril;