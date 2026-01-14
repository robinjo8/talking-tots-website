import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { GamesList } from "@/components/games/GamesList";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { Progress } from "@/components/ui/progress";
import { useDailyProgress } from "@/hooks/useDailyProgress";
import { FooterSection } from "@/components/FooterSection";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function GovorneIgre() {
  const { user, selectedChild, signOut, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const { dailyActivities, isLoading } = useDailyProgress();
  const isMobile = useIsMobile();
  
  const targetActivities = 15;
  const percentage = Math.min((dailyActivities / targetActivities) * 100, 100);

  console.log('🎯 GovorneIgre - Selected child:', selectedChild?.name);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate("/login");
    }
  }, [user, isAuthLoading, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error in GovorneIgre handleSignOut:", error);
      toast.error("Napaka pri odjavi");
    }
  };

  if (isAuthLoading || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Mobile Back Button */}
      {isMobile && (
        <Button
          onClick={() => navigate("/moje-aplikacije")}
          className="fixed bottom-6 left-6 z-50 h-14 w-14 rounded-full bg-app-orange hover:bg-app-orange/90 shadow-lg"
          size="icon"
        >
          <ArrowLeft className="h-6 w-6 text-white" />
        </Button>
      )}
      
      {/* Hero sekcija */}
      <section className="bg-dragon-green py-12 md:py-16 pt-24 md:pt-28">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Govorne igre{selectedChild ? `, ${selectedChild.name}` : ''}!
            </h1>
            <p className="text-xl text-white/90">
              Izberi igro in se zabavaj pri učenju!
            </p>
          </div>
          
          {selectedChild && (
            <div className="max-w-md mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">Tvoj dnevni napredek</span>
                  <span className="text-white font-bold text-sm">{dailyActivities}/{targetActivities} ⭐</span>
                </div>
                <Progress 
                  value={percentage} 
                  className="h-3 bg-white/20 [&>div]:bg-app-orange"
                />
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Bela sekcija z igre */}
      <section 
        className="py-12 bg-white min-h-screen" 
        style={{ backgroundColor: 'white' }}
      >
        <div className="container max-w-6xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-8">
            <BreadcrumbNavigation />
          </div>
          
          {selectedChild ? (
            <GamesList />
          ) : (
            <div className="min-h-[400px] flex flex-col items-center justify-center">
              <p className="text-lg text-red-500">
                Prosimo, dodajte profil otroka v nastavitvah.
              </p>
            </div>
          )}
        </div>
      </section>
      
      <FooterSection handleSignOut={handleSignOut} />
    </div>
  );
}