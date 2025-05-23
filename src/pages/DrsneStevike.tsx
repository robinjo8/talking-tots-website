
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
      <div className="absolute top-0 left-0 w-full h-full flex flex-col pt-16">
        <div className="container mx-auto px-4 flex items-center gap-3 py-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/govorne-igre")}>
            <ArrowLeft className="h-4 w-4" /> Nazaj
          </Button>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            Drsne številke
          </h1>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center overflow-hidden p-4">
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{
              maxWidth: "min(90vw, 90vh, 600px)",
              maxHeight: "min(90vw, 90vh, 600px)"
            }}
          >
            <SlidePuzzle size={4} className="w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
