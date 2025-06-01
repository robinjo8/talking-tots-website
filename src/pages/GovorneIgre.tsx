
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GamesList } from "@/components/games/GamesList";
import { Gamepad2 } from "lucide-react";

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
          
          <h1 className="text-2xl font-bold text-foreground">
            Govorne igre
          </h1>
        </div>
        
        <Card className="mb-8 rounded-2xl border-2 border-gray-200 transition-all duration-300 hover:shadow-lg">
          <CardHeader className="bg-gradient-to-r from-dragon-green/10 to-app-blue/10 rounded-t-2xl pb-4">
            <CardTitle className="flex items-center justify-center gap-2 text-center">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-200">
                <Gamepad2 className="h-6 w-6 text-dragon-green" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-4 text-center">
            <h2 className="text-xl font-bold mb-2 text-dragon-green">Izberi igro</h2>
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
