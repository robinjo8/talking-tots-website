import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const PolitikaZasebnosti = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Nazaj
        </Button>
        
        <h1 className="text-3xl font-bold text-dragon-green mb-6">Politika zasebnosti</h1>
        
        <div className="prose max-w-none">
          <p className="text-muted-foreground">
            Vsebina bo kmalu dodana.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PolitikaZasebnosti;
