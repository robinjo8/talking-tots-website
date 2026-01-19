import Header from "@/components/Header";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { TongueGymGame } from "@/components/games/TongueGymGame";

// Auth protection is now handled by ProtectedRoute in routes.tsx
const VajeZaJezik = () => {

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-5xl mx-auto pt-28 md:pt-32 pb-20 px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <BreadcrumbNavigation />
        </div>
        
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            Vaje za jezik
          </h1>
          <div className="w-32 h-1 bg-app-yellow mx-auto rounded-full"></div>
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
