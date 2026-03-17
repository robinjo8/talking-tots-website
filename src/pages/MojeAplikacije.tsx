import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ActivityOptions } from "@/components/ActivityOptions";
import { FooterSection } from "@/components/FooterSection";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { DailyStarsBar } from "@/components/DailyStarsBar";
import { SubscriptionGate } from "@/components/subscription/SubscriptionGate";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const MojeAplikacije = () => {
  const { user, selectedChild, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  console.log('🎯 MojeAplikacije - Selected child:', selectedChild?.name);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error in MojeAplikacije handleSignOut:", error);
      toast.error("Napaka pri odjavi");
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero sekcija */}
      <section className="bg-dragon-green py-12 md:py-16 pt-24 md:pt-28">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Izberi aktivnost
            </h1>
            <p className="text-xl text-white/90">
              Kaj bi rad danes vadil?
            </p>
          </div>
          
          <DailyStarsBar />
        </div>
      </section>
      
      {/* Bela sekcija z aktivnostmi */}
      <section 
        className="py-4 md:py-12 bg-white min-h-screen" 
        style={{ backgroundColor: 'white' }}
      >
        <div className="container max-w-6xl mx-auto px-4">
          <SubscriptionGate>
            {/* Breadcrumb */}
            <div className="hidden md:block mb-8">
              <BreadcrumbNavigation />
            </div>
            
            {selectedChild ? (
              <ActivityOptions />
            ) : (
              <div className="min-h-[400px] flex flex-col items-center justify-center">
                <p className="text-lg text-red-500">
                  Prosimo, dodajte profil otroka v nastavitvah.
                </p>
              </div>
            )}
          </SubscriptionGate>
        </div>
      </section>
      
      {/* Mobile Back Button */}
      {isMobile && (
        <Button
          onClick={() => navigate("/")}
          className="fixed bottom-6 left-6 z-50 h-14 w-14 rounded-full bg-app-orange hover:bg-app-orange/90 shadow-lg"
          size="icon"
        >
          <ArrowLeft className="h-6 w-6 text-white" />
        </Button>
      )}
      
      <FooterSection handleSignOut={handleSignOut} />
    </div>
  );
};

export default MojeAplikacije;