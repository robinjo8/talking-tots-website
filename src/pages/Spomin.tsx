
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { MemoryGrid } from "@/components/memory/MemoryGrid";

export default function Spomin() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-5xl mx-auto pt-32 pb-20 px-4">
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
            Spomin
          </h1>
        </div>
        
        <div className="w-full max-w-4xl mx-auto">
          <MemoryGrid />
        </div>
      </div>
    </div>
  );
}
