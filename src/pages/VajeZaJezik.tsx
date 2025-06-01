
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { TongueGymGame } from "@/components/games/TongueGymGame";

const VajeZaJezik = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-5xl mx-auto pt-32 pb-20 px-4">
        <div className="flex items-center gap-3 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2" 
            onClick={() => navigate("/govorno-jezikovne-vaje")}
          >
            <ArrowLeft className="h-4 w-4" />
            Nazaj na vaje
          </Button>
          
          <h1 className="text-2xl font-bold text-foreground">
            Vaje za jezik
          </h1>
        </div>
        
        <p className="text-muted-foreground mb-8">
          Gibalne vaje za jezik, ki pomagajo pri izboljšanju artikulacije in motorike govornih organov.
        </p>
        
        <TongueGymGame />
      </div>
    </div>
  );
};

export default VajeZaJezik;
