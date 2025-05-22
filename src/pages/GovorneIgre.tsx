
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Dog } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { GamesList } from "@/components/games/GamesList";

export default function GovorneIgre() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-7xl mx-auto pt-32 pb-20 px-4">
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
          
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Govorne igre
          </h1>
        </div>

        {/* New featured game banner */}
        <Card className="bg-gradient-to-r from-blue-100 to-green-100 mb-8 hover:shadow-lg transition-all">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row items-center">
              <div className="p-8 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-white p-2 rounded-full">
                    <Dog className="h-5 w-5 text-dragon-green" />
                  </div>
                  <span className="bg-dragon-green text-white text-xs font-bold px-2 py-1 rounded">
                    NOVO
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-2">Živali - Kuža</h2>
                <p className="text-muted-foreground mb-4">
                  Nova igra za vajo izgovorjave besede "kuža" s pomočjo zabavnih aktivnosti z živalmi.
                </p>
                <Button 
                  onClick={() => navigate("/govorne-igre/zivali")}
                  className="bg-dragon-green hover:bg-dragon-green/90"
                >
                  Začni igro
                </Button>
              </div>
              
              <div className="hidden md:block p-4">
                <img 
                  src="/lovable-uploads/958712cc-0a34-4066-a7f4-c947de96c29a.png"
                  alt="Kuža igra" 
                  className="h-40 object-contain"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-dragon-green/5 mb-8">
          <CardContent className="p-8">
            <h2 className="text-xl font-bold mb-2">Izberi igro</h2>
            <p className="text-muted-foreground">
              Izberi eno izmed govornih iger in začni vaditi izgovorjavo na zabaven način.
            </p>
          </CardContent>
        </Card>

        <GamesList />
      </div>
    </div>
  );
}
