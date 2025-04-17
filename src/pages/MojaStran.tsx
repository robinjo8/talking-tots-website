
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ProfileSection } from "@/components/ProfileSection";
import { ProgressSection } from "@/components/ProgressSection";
import { ActivityOptions } from "@/components/ActivityOptions";
import { TipSection } from "@/components/TipSection";
import { NoChildSelected } from "@/components/NoChildSelected";
import { FooterSection } from "@/components/FooterSection";

const MojaStran = () => {
  const { user, profile, signOut, selectedChildIndex } = useAuth();
  const navigate = useNavigate();
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);
  
  const selectedChild = selectedChildIndex !== null && profile?.children 
    ? profile.children[selectedChildIndex] 
    : null;

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-5xl mx-auto pt-32 pb-20 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {selectedChild ? (
              <>Živjo, <span className="text-dragon-green">{selectedChild.name}</span>!</>
            ) : (
              <>Pozdravljen, <span className="text-dragon-green">{profile?.username || user.email}</span>!</>
            )}
          </h1>
        </div>
        
        <ProfileSection 
          isProfileExpanded={isProfileExpanded}
          setIsProfileExpanded={setIsProfileExpanded}
          profile={profile}
          selectedChild={selectedChild}
        />
        
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
