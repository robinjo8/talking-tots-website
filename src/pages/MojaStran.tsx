
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ProgressSection } from "@/components/ProgressSection";
import { ActivityOptions } from "@/components/ActivityOptions";
import { TipSection } from "@/components/TipSection";
import { FooterSection } from "@/components/FooterSection";
import { MotivationalMessage } from "@/components/MotivationalMessage";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MojaStran = () => {
  const { user, profile, signOut, selectedChildIndex, setSelectedChildIndex } = useAuth();
  const navigate = useNavigate();
  
  const selectedChild = selectedChildIndex !== null && profile?.children 
    ? profile.children[selectedChildIndex] 
    : null;

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const handleSelectChild = (childIndex: string) => {
    const index = parseInt(childIndex);
    setSelectedChildIndex(index);
    localStorage.setItem('selectedChildIndex', index.toString());
    toast.success(`Izbrali ste: ${profile?.children?.[index].name}`);
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
            
            <TipSection childName={selectedChild.name} />
          </>
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-xl font-medium mb-2">Ni izbranega otroka</h3>
            <p className="text-muted-foreground mb-6">
              Prosimo, izberite otroka spodaj ali dodajte novega za prikaz personaliziranih vsebin.
            </p>
            
            {profile?.children && profile.children.length > 0 ? (
              <div className="flex flex-col items-center gap-4 max-w-xs mx-auto">
                <Select onValueChange={handleSelectChild}>
                  <SelectTrigger className="w-full border-dragon-green text-dragon-green">
                    <SelectValue placeholder="Izberite otroka" />
                  </SelectTrigger>
                  <SelectContent>
                    {profile.children.map((child, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {child.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="outline" 
                  className="w-full border-dragon-green text-dragon-green hover:bg-dragon-green/10"
                  onClick={() => navigate("/profile")}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Upravljaj profile
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                className="border-dragon-green text-dragon-green hover:bg-dragon-green/10"
                onClick={() => navigate("/profile")}
              >
                <Users className="h-4 w-4 mr-2" />
                Dodaj novega otroka
              </Button>
            )}
          </div>
        )}
        
        <FooterSection handleSignOut={handleSignOut} />
      </div>
    </div>
  );
};

export default MojaStran;
