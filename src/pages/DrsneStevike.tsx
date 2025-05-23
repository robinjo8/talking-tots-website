
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
      <div className="absolute top-0 left-0 w-full h-full flex flex-col">
        <div className="container mx-auto px-4 flex items-center gap-3 py-2 mt-16">
          <Button variant="ghost" size="sm" onClick={() => navigate("/govorne-igre")}>
            <ArrowLeft className="h-4 w-4" /> Nazaj
          </Button>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            Drsne številke
          </h1>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div 
            className="w-full h-auto flex items-center justify-center"
            style={{
              maxWidth: "min(85vw, 85vh, 600px)",
              maxHeight: "min(85vw, 85vh, 600px)"
            }}
          >
            <SlidePuzzle className="w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
