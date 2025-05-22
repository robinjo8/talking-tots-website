
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function DrsneStevike() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [iframeHeight, setIframeHeight] = useState("600px");
  const [iframeWidth, setIframeWidth] = useState("100%");

  // Adjust iframe dimensions based on screen size for better responsiveness
  useEffect(() => {
    const handleResize = () => {
      // Set height based on screen width brackets
      if (window.innerWidth < 640) {
        setIframeHeight("450px");
      } else if (window.innerWidth < 1024) {
        setIframeHeight("550px");
      } else {
        setIframeHeight("600px");
      }

      // Ensure width is appropriate for mobile and desktop views
      const maxWidth = Math.min(window.innerWidth - 32, 600); // 32px for padding
      setIframeWidth(isMobile ? "100%" : `${maxWidth}px`);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);
  
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
        
        <Card className="overflow-hidden bg-white mb-8 mx-auto" style={{ maxWidth: isMobile ? "100%" : "600px" }}>
          <div className="w-full h-full flex justify-center">
            <iframe 
              src="https://slide-puzzle-dttb.onrender.com" 
              title="Drsne številke" 
              className="border-none"
              style={{ 
                height: iframeHeight,
                width: iframeWidth,
                maxWidth: "100%",
                overflow: "hidden"
              }}
              loading="lazy"
              scrolling="no"
            ></iframe>
          </div>
        </Card>

        <div className="text-center text-muted-foreground mt-8 max-w-md mx-auto">
          <p className="mb-2">Cilj igre je urediti ploščice v pravilnem zaporedju.</p>
          <p>Premikaj ploščice tako, da klikneš na tisto, ki jo želiš premakniti na prazno mesto.</p>
        </div>
      </div>
    </div>
  );
}
