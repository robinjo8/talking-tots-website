
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
        <div className="bg-gradient-to-br from-app-blue to-app-blue/80 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex flex-col items-center text-center text-white h-full">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4">
              <BookText className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Govorno-jezikovne vaje</h3>
            <p className="text-white/90 mb-6 flex-grow">
              Prilagojene aktivnosti za izboljšanje otrokove izgovorjave.
            </p>
            <Button 
              className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-0"
              onClick={handleGoToExercises}
            >
              Pojdi na vaje
            </Button>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-app-purple to-app-purple/80 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex flex-col items-center text-center text-white h-full">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4">
              <Gamepad className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Govorne igre</h3>
            <p className="text-white/90 mb-6 flex-grow">
              Zabavne igre za izboljšanje izgovorjave.
            </p>
            <Button 
              className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-0"
              onClick={handleGoToGames}
            >
              Začni igro
            </Button>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-[#9b87f5] to-[#8B5CF6] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex flex-col items-center text-center text-white h-full">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4">
              <TestTube className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Artikulacijski test</h3>
            <p className="text-white/90 mb-6 flex-grow">
              Test izgovorjave za vse slovenske soglasnike.
            </p>
            <Button 
              className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-0"
              onClick={handleGoToArticulationTest}
            >
              Začni test
            </Button>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-app-orange to-app-orange/80 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex flex-col items-center text-center text-white h-full">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Moji izzivi</h3>
            <p className="text-white/90 mb-6 flex-grow">
              Izberi, s katero izgovorjavo imaš težave in prejmi prilagojene vaje.
            </p>
            <Button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-0">
              Izberi težavo
            </Button>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-app-teal to-app-teal/80 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 md:col-span-2">
          <div className="flex flex-col items-center text-center text-white h-full max-w-md mx-auto">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4">
              <Video className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Video navodila</h3>
            <p className="text-white/90 mb-6 flex-grow">
              Poglej kako logoped pravilno izgovori posamezne črke.
            </p>
            <Button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-0">
              Poglej video
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
