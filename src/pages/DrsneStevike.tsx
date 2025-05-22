
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function DrsneStevike() {
  const navigate = useNavigate();
  const [iframeHeight, setIframeHeight] = useState("600px");

  // Adjust iframe height based on screen size for better responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setIframeHeight("500px");
      } else if (window.innerWidth < 1024) {
        setIframeHeight("550px");
      } else {
        setIframeHeight("600px");
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-7xl mx-auto pt-32 pb-20 px-4">
        <div className="flex items-center gap-3 mb-8">
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
        
        <Card className="overflow-hidden bg-white mb-8">
          <div className="w-full h-full">
            <iframe 
              src="https://slide-puzzle-dttb.onrender.com" 
              title="Drsne številke" 
              className="w-full border-none"
              style={{ height: iframeHeight }}
              loading="lazy"
            ></iframe>
          </div>
        </Card>

        <div className="text-center text-muted-foreground mt-8">
          <p className="mb-2">Cilj igre je urediti ploščice v pravilnem zaporedju.</p>
          <p>Premikaj ploščice tako, da klikneš na tisto, ki jo želiš premakniti na prazno mesto.</p>
        </div>
      </div>
    </div>
  );
}
