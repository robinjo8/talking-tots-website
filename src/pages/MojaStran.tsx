
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { ProgressSection } from "@/components/ProgressSection";
import { ActivityOptions } from "@/components/ActivityOptions";
import { ArticulationTest } from "@/components/ArticulationTest";
import { TipSection } from "@/components/TipSection";
import { NoChildSelected } from "@/components/NoChildSelected";
import { FooterSection } from "@/components/FooterSection";
import { MotivationalMessage } from "@/components/MotivationalMessage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scissors } from "lucide-react";

const MojaStran = () => {
  const { user, profile, signOut, selectedChildIndex } = useAuth();
  const navigate = useNavigate();
  
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
        
        {selectedChild ? (
          <>
            <MotivationalMessage />
            
            <ProgressSection />
            
            <ActivityOptions />
            
            {/* Artikulacijski test section */}
            <Card 
              className="mb-8 cursor-pointer hover:shadow-md transition-all"
              onClick={() => navigate("/artikulacijski-test")}
            >
              <CardHeader className="bg-gradient-to-r from-app-purple/10 to-app-teal/10">
                <CardTitle className="flex items-center gap-2">
                  <Scissors className="h-6 w-6 text-app-purple" />
                  Artikulacijski test
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-lg">
                  Pregled artikulacije slovenskih soglasnikov za prepoznavanje težav z izgovorjavo.
                </p>
              </CardContent>
            </Card>
            
            <ArticulationTest />
            
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
