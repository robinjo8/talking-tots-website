
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ProgressSection } from "@/components/ProgressSection";
import { TipSection } from "@/components/TipSection";
// NoChildSelected component removed - only one child per parent now
import { FooterSection } from "@/components/FooterSection";


const MojaStran = () => {
  const { user, profile, signOut, selectedChild } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error in MojaStran handleSignOut:", error);
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
      
      <div className="container max-w-5xl mx-auto pt-28 md:pt-32 pb-20 px-4">
        
        {selectedChild ? (
          <>
            {/* Progress Section Wrapper */}
            <div className="mb-12">
              <ProgressSection />
            </div>
            
            <TipSection childName={selectedChild.name} />
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Nimate še nobenega otroškega profila</h2>
            <p className="text-muted-foreground mb-8">Za začetek dodajte profil otroka v nastavitvah.</p>
            <button 
              onClick={() => navigate("/profile")}
              className="bg-dragon-green hover:bg-dragon-green/90 text-white px-6 py-3 rounded-lg"
            >
              Dodaj profil otroka
            </button>
          </div>
        )}
        
        <FooterSection handleSignOut={handleSignOut} />
      </div>
    </div>
  );
};

export default MojaStran;
