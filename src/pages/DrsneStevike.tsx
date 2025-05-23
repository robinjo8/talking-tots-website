
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SlidePuzzle from "@/components/games/SlidePuzzle";

export default function DrsneStevilke() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col mt-16">
        <div className="container mx-auto px-4 flex items-center gap-3 py-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/govorne-igre")}>
            <ArrowLeft className="h-4 w-4" /> Nazaj
          </Button>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            Drsne številke
          </h1>
        </div>
        
        <div className="flex-1 flex items-start justify-center px-4 pt-2">
          <div 
            className="w-full"
            style={{
              maxWidth: "min(90vw, 90vh, 650px)",
              height: "min(85vh, 650px)"
            }}
          >
            <SlidePuzzle className="w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
