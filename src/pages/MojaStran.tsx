import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ProgressSection } from "@/components/ProgressSection";
import { TipSection } from "@/components/TipSection";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { FooterSection } from "@/components/FooterSection";
import { SubscriptionGate } from "@/components/subscription/SubscriptionGate";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";


const MojaStran = () => {
  const { user, selectedChild, signOut, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error in MojaStran handleSignOut:", error);
      toast.error("Napaka pri odjavi");
    }
  };

  if (isLoading || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-5xl mx-auto pt-28 md:pt-32 pb-20 px-4">
        <SubscriptionGate>
          {/* Breadcrumb */}
          <div className="mb-8">
            <BreadcrumbNavigation />
          </div>
          
          {selectedChild ? (
            <>
              {/* Progress Section Wrapper */}
              <div className="mb-12">
                <ProgressSection />
              </div>
              
              <TipSection childName={selectedChild.name} />

              {/* AI Chat Assistant Card */}
              <div className="mt-12 rounded-2xl border border-border bg-gradient-to-r from-app-orange/5 to-app-orange/10 p-6 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-app-orange/10 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-app-orange" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-semibold text-foreground">Imate vprašanja o govoru?</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Vprašajte Tomija, našega AI logopedskega pomočnika.
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/pomoc-chat")}
                  className="bg-app-orange hover:bg-app-orange/90 text-white rounded-xl"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Odpri chat
                </Button>
              </div>
            </>
          ) : (
            <div className="min-h-[400px] flex flex-col items-center justify-center">
              <p className="text-lg text-muted-foreground">Prosimo, dodajte profil otroka v nastavitvah.</p>
            </div>
          )}
          
          <FooterSection handleSignOut={handleSignOut} />
        </SubscriptionGate>
      </div>
    </div>
  );
};

export default MojaStran;
