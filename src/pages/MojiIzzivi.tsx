
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function MojiIzzivi() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen w-full bg-background">
      <Header />
      
      <div className="w-full pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-7xl">
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
              Moji izzivi
            </h1>
          </div>
          
          <Card className="bg-app-blue/5">
            <CardContent className="p-8 text-center">
              <p className="text-lg text-muted-foreground">
                Tukaj boš našel svoje govorne izzive, ki jih lahko opraviš za dodatne točke!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
