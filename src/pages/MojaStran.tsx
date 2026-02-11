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
      window.location.href = "/login";
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
