
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ProgressSection } from "@/components/ProgressSection";
import { ActivityOptions } from "@/components/ActivityOptions";
import { TipSection } from "@/components/TipSection";
import { NoChildSelected } from "@/components/NoChildSelected";
import { FooterSection } from "@/components/FooterSection";


const MojaStran = () => {
  const { user, profile, signOut, selectedChildIndex } = useAuth();
  const navigate = useNavigate();
  
  const selectedChild = selectedChildIndex !== null && profile?.children 
    ? profile.children[selectedChildIndex] 
    : null;

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
            <ProgressSection />
            
            <ActivityOptions />
            
            <TipSection childName={selectedChild.name} />
          </>
        ) : (
          <NoChildSelected />
        )}
        
        <FooterSection handleSignOut={handleSignOut} />
      </div>
    </div>
  );
};

export default MojaStran;
