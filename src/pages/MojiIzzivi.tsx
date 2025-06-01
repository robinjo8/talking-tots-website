
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MojiIzzivi() {
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
            Moji izzivi
          </h1>
        </div>
        
        <Card className="rounded-2xl border-2 border-gray-200 transition-all duration-300 hover:shadow-lg">
          <CardHeader className="bg-gradient-to-r from-app-orange/10 to-app-yellow/10 rounded-t-2xl pb-4">
            <CardTitle className="flex items-center justify-center gap-2 text-center">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-200">
                <Zap className="h-6 w-6 text-app-orange" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-4 text-center">
            <h3 className="text-lg font-semibold mb-2 text-app-orange">Moji izzivi</h3>
            <p className="text-sm text-gray-600">
              Tukaj boš našel svoje govorne izzive, ki jih lahko opraviš za dodatne točke!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
