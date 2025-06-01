
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookText, Gamepad, Zap, Video, TestTube } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ActivityOptions() {
  const navigate = useNavigate();
  
  const handleGoToExercises = () => {
    navigate("/govorno-jezikovne-vaje");
  };
  
  const handleGoToGames = () => {
    navigate("/govorne-igre");
  };
  
  const handleGoToArticulationTest = () => {
    navigate("/artikulacijski-test");
  };
  
  return (
    <>
      <h2 className="text-2xl font-bold mb-6 mt-12">Izberi možnost:</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card className="overflow-hidden rounded-3xl shadow-lg border-0 bg-white">
          <div className="bg-gradient-to-br from-app-blue to-app-blue/80 p-8 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookText className="h-8 w-8 text-app-blue" />
            </div>
          </div>
          <CardContent className="p-6 text-center">
            <CardTitle className="text-xl mb-3 text-gray-800">
              Govorno-jezikovne vaje
            </CardTitle>
            <p className="text-gray-600 mb-6">
              Prilagojene aktivnosti za izboljšanje otrokove izgovorjave.
            </p>
            <Button 
              className="w-full bg-app-blue hover:bg-app-blue/90 rounded-xl"
              onClick={handleGoToExercises}
            >
              Pojdi na vaje
            </Button>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden rounded-3xl shadow-lg border-0 bg-white">
          <div className="bg-gradient-to-br from-app-purple to-app-purple/80 p-8 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Gamepad className="h-8 w-8 text-app-purple" />
            </div>
          </div>
          <CardContent className="p-6 text-center">
            <CardTitle className="text-xl mb-3 text-gray-800">
              Govorne igre
            </CardTitle>
            <p className="text-gray-600 mb-6">
              Zabavne igre za izboljšanje izgovorjave.
            </p>
            <Button 
              className="w-full bg-app-purple hover:bg-app-purple/90 rounded-xl"
              onClick={handleGoToGames}
            >
              Začni igro
            </Button>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden rounded-3xl shadow-lg border-0 bg-white">
          <div className="bg-gradient-to-br from-[#9b87f5] to-[#8B5CF6] p-8 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TestTube className="h-8 w-8 text-[#9b87f5]" />
            </div>
          </div>
          <CardContent className="p-6 text-center">
            <CardTitle className="text-xl mb-3 text-gray-800">
              Artikulacijski test
            </CardTitle>
            <p className="text-gray-600 mb-6">
              Test izgovorjave za vse slovenske soglasnike.
            </p>
            <Button 
              className="w-full bg-[#9b87f5] hover:bg-[#8B5CF6] rounded-xl"
              onClick={handleGoToArticulationTest}
            >
              Začni test
            </Button>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden rounded-3xl shadow-lg border-0 bg-white">
          <div className="bg-gradient-to-br from-app-orange to-app-orange/80 p-8 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-app-orange" />
            </div>
          </div>
          <CardContent className="p-6 text-center">
            <CardTitle className="text-xl mb-3 text-gray-800">
              Moji izzivi
            </CardTitle>
            <p className="text-gray-600 mb-6">
              Izberi, s katero izgovorjavo imaš težave in prejmi prilagojene vaje.
            </p>
            <Button className="w-full bg-app-orange hover:bg-app-orange/90 rounded-xl">
              Izberi težavo
            </Button>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden rounded-3xl shadow-lg border-0 bg-white md:col-span-2 max-w-md mx-auto">
          <div className="bg-gradient-to-br from-app-teal to-app-teal/80 p-8 text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Video className="h-8 w-8 text-app-teal" />
            </div>
          </div>
          <CardContent className="p-6 text-center">
            <CardTitle className="text-xl mb-3 text-gray-800">
              Video navodila
            </CardTitle>
            <p className="text-gray-600 mb-6">
              Poglej kako logoped pravilno izgovori posamezne črke.
            </p>
            <Button className="w-full bg-app-teal hover:bg-app-teal/90 rounded-xl">
              Poglej video
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
