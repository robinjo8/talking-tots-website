
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GamesList } from "@/components/games/GamesList";

export default function GovorneIgre() {
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
            onClick={() => navigate("/moja-stran")}
          >
            <ArrowLeft className="h-4 w-4" />
            Nazaj
          </Button>
          
          <h1 className="text-2xl font-bold text-foreground">
            Govorne igre
          </h1>
        </div>
        
        <p className="text-muted-foreground mb-8">
          Izberi eno izmed govornih iger in začni vaditi izgovorjavo na zabaven način.
        </p>

        <GamesList />
      </div>
    </div>
  );
}
