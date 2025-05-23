
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect, useState, useRef } from "react";

export default function DrsneStevike() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState("500px");
  const [containerWidth, setContainerWidth] = useState("100%");

  // Calculate optimal container dimensions based on viewport
  useEffect(() => {
    const calculateOptimalDimensions = () => {
      // Get viewport dimensions
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      // Calculate available space (accounting for header and padding)
      const headerOffset = 130; // Estimated header height + padding
      const footerOffset = 80;  // Space for bottom content and padding
      const sideMargin = 30;    // Side margins
      
      // Calculate available dimensions
      const availableHeight = viewportHeight - headerOffset - footerOffset;
      const availableWidth = viewportWidth - (sideMargin * 2);
      
      // Determine if mobile or desktop
      const isMobile = viewportWidth < 768;
      
      // Set optimal size (95% of available space to avoid any scrolling)
      let optimalHeight = Math.min(availableHeight * 0.95, 600); // Cap at 600px height
      let optimalWidth = isMobile ? availableWidth * 0.95 : Math.min(availableWidth * 0.95, 600); // Cap width on desktop
      
      // Ensure square aspect ratio for the game container (game is square)
      const finalSize = Math.min(optimalHeight, optimalWidth);
      
      // Set dimensions
      setContainerHeight(`${finalSize}px`);
      setContainerWidth(`${finalSize}px`);
    };

    // Calculate on initial load
    calculateOptimalDimensions();
    
    // Recalculate on resize
    window.addEventListener('resize', calculateOptimalDimensions);
    return () => window.removeEventListener('resize', calculateOptimalDimensions);
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-7xl mx-auto pt-20 pb-8 px-4">
        <div className="flex items-center gap-3 mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2" 
            onClick={() => navigate("/govorne-igre")}
          >
            <ArrowLeft className="h-4 w-4" />
            Nazaj
          </Button>
          
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            Drsne številke
          </h1>
        </div>
        
        <div className="flex flex-col items-center">
          <Card 
            className="overflow-hidden bg-white mb-4" 
            ref={containerRef} 
            style={{ 
              width: containerWidth,
              height: containerHeight,
              margin: "0 auto"
            }}
          >
            <iframe 
              src="https://slide-puzzle-dttb.onrender.com" 
              title="Drsne številke" 
              className="w-full max-w-full h-[90vh] overflow-hidden border-none"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
            ></iframe>
          </Card>

          <div className="text-center text-muted-foreground mt-2 max-w-lg">
            <p className="text-sm">Cilj igre je urediti ploščice v pravilnem zaporedju.</p>
            <p className="text-sm">Premikaj ploščice tako, da klikneš na tisto, ki jo želiš premakniti na prazno mesto.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
