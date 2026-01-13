import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle, ArrowLeft } from "lucide-react";

export default function PaymentCanceled() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-2 border-gray-200 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="mb-6 flex justify-center">
            <XCircle className="h-20 w-20 text-gray-400" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Plačilo preklicano
          </h1>

          <p className="text-gray-600 mb-6">
            Vaše plačilo ni bilo dokončano. 
            Če ste imeli težave, nas prosim kontaktirajte.
          </p>

          <div className="space-y-3">
            <Button
              className="w-full bg-dragon-green hover:bg-dragon-green/90 text-white"
              onClick={() => navigate("/cenik")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Nazaj na cenik
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/")}
            >
              Nazaj na domačo stran
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
