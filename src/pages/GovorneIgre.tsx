
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
          
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Govorne igre
          </h1>
        </div>
        
        <Card className="bg-dragon-green/5">
          <CardContent className="p-8 text-center">
            <p className="text-lg text-muted-foreground">
              Zabavne igre za izboljšanje izgovorjave skozi igro.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
