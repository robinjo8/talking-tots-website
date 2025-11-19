
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
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
      
      <div className="container max-w-5xl mx-auto pt-28 md:pt-32 pb-20 px-4">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            Vaje za jezik
          </h1>
          <div className="w-32 h-1 bg-app-yellow mx-auto rounded-full"></div>
        </div>
        
        {/* Breadcrumb - Desktop only */}
        <div className="hidden lg:block mb-8">
          <BreadcrumbNavigation />
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
