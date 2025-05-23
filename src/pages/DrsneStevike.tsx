import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
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
      <div className="container mx-auto pt-20 pb-8 px-4 flex-1">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/govorne-igre")}>
            <ArrowLeft className="h-4 w-4" /> Nazaj
          </Button>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            Drsne številke
          </h1>
        </div>
        <div className="flex flex-col items-center">
          <Card className="bg-white p-4">
            <div ref={puzzleRef} className="puzzle-root" />
          </Card>
          <div className="text-center text-muted-foreground mt-2 max-w-lg">
            <p className="text-sm">Cilj igre je urediti ploščice v pravilnem zaporedju.</p>
            <p className="text-sm">Premikaj ploščice tako, da klikneš tisto, ki jo želiš premakniti.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
