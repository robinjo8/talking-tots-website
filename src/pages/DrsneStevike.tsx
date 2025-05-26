
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SlidePuzzle from "@/components/games/SlidePuzzle";

export default function DrsneStevilke() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen overflow-hidden bg-background flex flex-col">
      <Header />
      
      {/* Header bar with back button and title */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-2 bg-background border-b">
        <Button variant="ghost" size="sm" onClick={() => navigate("/govorne-igre")}>
          <ArrowLeft className="h-4 w-4" /> Nazaj
        </Button>
        <h1 className="text-lg md:text-xl font-bold text-foreground">
          Drsne številke
        </h1>
      </div>
      
      {/* Game container - fills remaining screen space */}
      <div className="flex-1 w-full overflow-hidden">
        <SlidePuzzle className="w-full h-full" />
      </div>
    </div>
  );
}
