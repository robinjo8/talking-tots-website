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
  return <>
      <h2 className="text-2xl font-bold mb-6 mt-12">Izberi možnost:</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card className="transition-all duration-300 hover:shadow-lg rounded-3xl border-2 border-gray-200">
          <CardHeader className="bg-gradient-to-r from-app-blue/10 to-app-teal/10 rounded-t-3xl pb-4">
            <CardTitle className="text-xl flex items-center justify-center gap-2 text-center">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-200">
                <BookText className="h-6 w-6 text-app-blue" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-4 text-center">
            <h3 className="text-lg font-semibold mb-2 text-app-blue">Vaje</h3>
            <p className="text-sm text-gray-600">Prilagojene aktivnosti za izboljšanje otrokove izgovorjave.</p>
          </CardContent>
          <CardFooter className="pb-6">
            <Button className="w-full bg-app-blue hover:bg-app-blue/90 rounded-2xl" onClick={handleGoToExercises}>
              Pojdi na vaje
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="transition-all duration-300 hover:shadow-lg rounded-3xl border-2 border-gray-200">
          <CardHeader className="bg-gradient-to-r from-app-purple/10 to-app-blue/10 rounded-t-3xl pb-4">
            <CardTitle className="text-xl flex items-center justify-center gap-2 text-center">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-200">
                <Gamepad className="h-6 w-6 text-app-purple" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-4 text-center">
            <h3 className="text-lg font-semibold mb-2 text-app-purple">Igre</h3>
            <p className="text-sm text-gray-600">Zabavne igre za izboljšanje izgovorjave.</p>
          </CardContent>
          <CardFooter className="pb-6">
            <Button className="w-full bg-app-purple hover:bg-app-purple/90 rounded-2xl" onClick={handleGoToGames}>
              Začni igro
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="transition-all duration-300 hover:shadow-lg rounded-3xl border-2 border-gray-200 h-full flex flex-col">
          <CardHeader className="bg-gradient-to-r from-app-purple/10 to-app-teal/10 rounded-t-3xl pb-4">
            <CardTitle className="text-xl flex items-center justify-center gap-2 text-center">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-200">
                <TestTube className="h-6 w-6 text-app-purple" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-4 flex-grow text-center">
            <h3 className="text-lg font-semibold mb-2 text-app-purple">Artikulacijski test</h3>
            <p className="text-sm text-gray-600">Test izgovorjave za vse slovenske soglasnike.</p>
          </CardContent>
          <CardFooter className="pb-6">
            <Button className="w-full bg-[#9b87f5] hover:bg-[#8B5CF6] rounded-2xl" onClick={handleGoToArticulationTest}>
              Začni test
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="transition-all duration-300 hover:shadow-lg rounded-3xl border-2 border-gray-200 h-full flex flex-col">
          <CardHeader className="bg-gradient-to-r from-app-orange/10 to-app-yellow/10 rounded-t-3xl pb-4">
            <CardTitle className="text-xl flex items-center justify-center gap-2 text-center">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-200">
                <Zap className="h-6 w-6 text-app-orange" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-4 flex-grow text-center">
            <h3 className="text-lg font-semibold mb-2 text-app-orange">Moji izzivi</h3>
            <p className="text-sm text-gray-600">Izberi, s katero izgovorjavo imaš težave in prejmi prilagojene vaje.</p>
          </CardContent>
          <CardFooter className="pb-6">
            <Button className="w-full bg-app-orange hover:bg-app-orange/90 rounded-2xl">
              Izberi težavo
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="transition-all duration-300 hover:shadow-lg rounded-3xl border-2 border-gray-200 h-full flex flex-col">
          <CardHeader className="bg-gradient-to-r from-app-teal/10 to-dragon-green/10 rounded-t-3xl pb-4">
            <CardTitle className="text-xl flex items-center justify-center gap-2 text-center">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-200">
                <Video className="h-6 w-6 text-app-teal" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-4 flex-grow text-center">
            <h3 className="text-lg font-semibold mb-2 text-app-teal">Video navodila</h3>
            <p className="text-sm text-gray-600">Poglej kako logoped pravilno izgovori posamezne črke.</p>
          </CardContent>
          <CardFooter className="pb-6">
            <Button className="w-full bg-app-teal hover:bg-app-teal/90 rounded-2xl">
              Poglej video
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>;
}