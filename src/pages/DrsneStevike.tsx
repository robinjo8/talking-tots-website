import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect, useState, useRef } from "react";

export default function DrsneStevike() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [sizePx, setSizePx] = useState({ width: "100%", height: "500px" });

  useEffect(() => {
    const calculateOptimalDimensions = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const headerOffset = 130; // višina header + padding
      const footerOffset = 80;  // spodnji padding
      const sideMargin = 30;    // stranski robovi

      const availH = vh - headerOffset - footerOffset;
      const availW = vw - sideMargin * 2;
      const isMobile = vw < 768;

      // 95% razpoložljivega prostora, omejeno na max 90vh/90vw
      let optH = Math.min(availH * 0.95, vh * 0.9);
      let optW = isMobile ? availW * 0.95 : Math.min(availW * 0.95, vw * 0.9);

      // zagotovimo kvadrat
      const final = Math.min(optH, optW);
      setSizePx({ width: `${final}px`, height: `${final}px` });
    };

    calculateOptimalDimensions();
    window.addEventListener("resize", calculateOptimalDimensions);
    return () => window.removeEventListener("resize", calculateOptimalDimensions);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <div className="container max-w-7xl mx-auto pt-20 pb-8 px-4 flex-1">
        <div className="flex items-center gap-3 mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2" 
            onClick={() => navigate("/govorne-igre")}
          >
            <ArrowLeft className="h-4 w-4" /> Nazaj
          </Button>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            Drsne številke
          </h1>
        </div>

        <div className="flex flex-col items-center">
          <Card 
            className="overflow-hidden bg-white mb-4 relative" 
            ref={containerRef}
            style={{
              width:  sizePx.width,
              height: sizePx.height,
              margin: "0 auto",
            }}
          >
            {/* Responsive iframe */}
            <iframe
              src="https://slide-puzzle-dttb.onrender.com"
              title="Drsne številke"
              className="absolute top-0 left-0 w-full h-full border-none"
              style={{ aspectRatio: "1 / 1" }}
              loading="lazy"
            />
          </Card>

          <div className="text-center text-muted-foreground mt-2 max-w-lg">
            <p className="text-sm">
              Cilj igre je urediti ploščice v pravilnem zaporedju.
            </p>
            <p className="text-sm">
              Premikaj ploščice tako, da klikneš na tisto, ki jo želiš premakniti.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
