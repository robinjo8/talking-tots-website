import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ActivityOptions } from "@/components/ActivityOptions";

import { FooterSection } from "@/components/FooterSection";

const MojeAplikacije = () => {
  const { user, selectedChild, signOut } = useAuth();
  const navigate = useNavigate();
  

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
      
      <div className="container max-w-5xl mx-auto pt-28 md:pt-32 pb-20 px-4">
        
        {selectedChild ? (
          <>
            {/* Activity Options Wrapper */}
            <div className="mb-12">
              <ActivityOptions />
            </div>
          </>
        ) : (
          <div className="min-h-[400px] flex flex-col items-center justify-center">
            <p className="text-lg text-muted-foreground">Prosimo, dodajte profil otroka v nastavitvah.</p>
          </div>
        )}
        
        <FooterSection handleSignOut={handleSignOut} />
      </div>
    </div>
  );
};

export default MojeAplikacije;