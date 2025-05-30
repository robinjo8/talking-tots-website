
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {/* Govorno-jezikovne vaje */}
        <Card className="relative overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-2xl group cursor-pointer" onClick={handleGoToExercises}>
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-app-blue via-app-blue to-app-teal rounded-t-2xl"></div>
          <CardHeader className="relative z-10 pt-8 pb-4 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl shadow-lg flex items-center justify-center">
              <BookText className="h-8 w-8 text-app-blue" />
            </div>
          </CardHeader>
          <CardContent className="pt-0 px-6 text-center">
            <CardTitle className="text-lg font-bold mb-3 text-gray-800">Govorno-jezikovne vaje</CardTitle>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Prilagojene aktivnosti za izboljšanje otrokove izgovorjave.
            </p>
          </CardContent>
          <CardFooter className="px-6 pb-6">
            <Button 
              className="w-full bg-app-blue hover:bg-app-blue/90 text-white rounded-xl py-3 font-semibold transition-all duration-200"
            >
              Pojdi na vaje
            </Button>
          </CardFooter>
        </Card>
        
        {/* Govorne igre */}
        <Card className="relative overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-2xl group cursor-pointer" onClick={handleGoToGames}>
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-app-purple via-app-purple to-[#9b87f5] rounded-t-2xl"></div>
          <CardHeader className="relative z-10 pt-8 pb-4 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl shadow-lg flex items-center justify-center">
              <Gamepad className="h-8 w-8 text-app-purple" />
            </div>
          </CardHeader>
          <CardContent className="pt-0 px-6 text-center">
            <CardTitle className="text-lg font-bold mb-3 text-gray-800">Govorne igre</CardTitle>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Zabavne igre za izboljšanje izgovorjave.
            </p>
          </CardContent>
          <CardFooter className="px-6 pb-6">
            <Button 
              className="w-full bg-app-purple hover:bg-app-purple/90 text-white rounded-xl py-3 font-semibold transition-all duration-200"
            >
              Začni igro
            </Button>
          </CardFooter>
        </Card>
        
        {/* Artikulacijski test */}
        <Card className="relative overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-2xl group cursor-pointer" onClick={handleGoToArticulationTest}>
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-[#9b87f5] via-[#8B5CF6] to-app-purple rounded-t-2xl"></div>
          <CardHeader className="relative z-10 pt-8 pb-4 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl shadow-lg flex items-center justify-center">
              <TestTube className="h-8 w-8 text-[#9b87f5]" />
            </div>
          </CardHeader>
          <CardContent className="pt-0 px-6 text-center">
            <CardTitle className="text-lg font-bold mb-3 text-gray-800">Artikulacijski test</CardTitle>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Test izgovorjave za vse slovenske soglasnike.
            </p>
          </CardContent>
          <CardFooter className="px-6 pb-6">
            <Button 
              className="w-full bg-[#9b87f5] hover:bg-[#8B5CF6] text-white rounded-xl py-3 font-semibold transition-all duration-200"
            >
              Začni test
            </Button>
          </CardFooter>
        </Card>
        
        {/* Moji izzivi */}
        <Card className="relative overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-2xl group cursor-pointer">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-app-orange via-app-orange to-app-yellow rounded-t-2xl"></div>
          <CardHeader className="relative z-10 pt-8 pb-4 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl shadow-lg flex items-center justify-center">
              <Zap className="h-8 w-8 text-app-orange" />
            </div>
          </CardHeader>
          <CardContent className="pt-0 px-6 text-center">
            <CardTitle className="text-lg font-bold mb-3 text-gray-800">Moji izzivi</CardTitle>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Izberi, s katero izgovorjavo imaš težave in prejmi prilagojene vaje.
            </p>
          </CardContent>
          <CardFooter className="px-6 pb-6">
            <Button className="w-full bg-app-orange hover:bg-app-orange/90 text-white rounded-xl py-3 font-semibold transition-all duration-200">
              Izberi težavo
            </Button>
          </CardFooter>
        </Card>
        
        {/* Video navodila */}
        <Card className="relative overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0 rounded-2xl group cursor-pointer">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-app-teal via-app-teal to-dragon-green rounded-t-2xl"></div>
          <CardHeader className="relative z-10 pt-8 pb-4 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl shadow-lg flex items-center justify-center">
              <Video className="h-8 w-8 text-app-teal" />
            </div>
          </CardHeader>
          <CardContent className="pt-0 px-6 text-center">
            <CardTitle className="text-lg font-bold mb-3 text-gray-800">Video navodila</CardTitle>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Poglej kako logoped pravilno izgovori posamezne črke.
            </p>
          </CardContent>
          <CardFooter className="px-6 pb-6">
            <Button className="w-full bg-app-teal hover:bg-app-teal/90 text-white rounded-xl py-3 font-semibold transition-all duration-200">
              Poglej video
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
