
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function DrsneStevike() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-32 pb-8 px-4">
        <div className="container max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2" 
              onClick={() => navigate("/govorne-igre")}
            >
              <ArrowLeft className="h-4 w-4" />
              Nazaj
            </Button>
            
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Drsne številke
            </h1>
          </div>
          
          {/* Game Container with Responsive Layout */}
          <div className="flex flex-col items-center justify-center gap-4">
            <Card className="overflow-hidden bg-white w-full max-w-[600px]">
              <div 
                className="game-container relative w-full"
                style={{
                  height: 'clamp(300px, min(90vw, 90vh - 200px), 600px)',
                  aspectRatio: '1 / 1'
                }}
              >
                <iframe 
                  src="https://slide-puzzle-dttb.onrender.com" 
                  title="Drsne številke" 
                  className="w-full h-full border-none"
                  loading="lazy"
                  style={{
                    minHeight: '300px',
                    maxHeight: '600px'
                  }}
                />
              </div>
            </Card>

            {/* Instructions */}
            <div className="text-center text-muted-foreground max-w-[600px] px-4">
              <p className="mb-2 text-sm md:text-base">
                Cilj igre je urediti ploščice v pravilnem zaporedju.
              </p>
              <p className="text-sm md:text-base">
                Premikaj ploščice tako, da klikneš na tisto, ki jo želiš premakniti na prazno mesto.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
