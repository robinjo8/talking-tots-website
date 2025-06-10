
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { PageHeader } from "@/components/PageHeader";
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
      <PageHeader title="Vaje za jezik" backPath="/govorno-jezikovne-vaje" />
      
      <div className="container max-w-5xl mx-auto pt-8 pb-20 px-4">
        <p className="text-muted-foreground mb-8">
          Gibalne vaje za jezik, ki pomagajo pri izboljšanju artikulacije in motorike govornih organov.
        </p>
        
        <TongueGymGame />
      </div>
    </div>
  );
};

export default VajeZaJezik;
