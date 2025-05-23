
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

// Uvozi našo igro
import createSlidePuzzle from "../slide-puzzle/app.js";
import "../slide-puzzle/style.css";

export default function DrsneStevilke() {
  const navigate = useNavigate();
  const puzzleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (puzzleRef.current) {
      createSlidePuzzle(puzzleRef.current);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="absolute top-0 left-0 w-full h-full flex flex-col pt-16">
        <div className="container mx-auto px-4 flex items-center gap-3 py-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/govorne-igre")}>
            <ArrowLeft className="h-4 w-4" /> Nazaj
          </Button>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            Drsne številke
          </h1>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center overflow-hidden">
          <div className="relative w-full h-full flex items-center justify-center">
            <div 
              className="puzzle-container aspect-square" 
              style={{
                maxWidth: "min(90vw, 90vh, 600px)",
                width: "min(90vw, 90vh, 600px)",
                height: "min(90vw, 90vh, 600px)"
              }}
            >
              <div ref={puzzleRef} className="puzzle-root w-full h-full" />
              
              <div className="text-center text-muted-foreground mt-4 px-4">
                <p className="text-sm">Cilj igre je urediti ploščice v pravilnem zaporedju.</p>
                <p className="text-sm">Premikaj ploščice tako, da klikneš tisto, ki jo želiš premakniti.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
