
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookText, Gamepad, Zap, Video, TestTube } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ActivityOptions() {
  const navigate = useNavigate();
  
  const handleGoToExercises = () => {
    navigate("/govorno-jezikovne-vaje");
  };
  
  const handleGoToTongueGym = () => {
    navigate("/vaje-za-jezik");
  };
  
  const handleGoToArticulationTest = () => {
    navigate("/artikulacijski-test");
  };
  
  return (
    <>
      <h2 className="text-2xl font-bold mb-6 mt-12">Izberi možnost:</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader className="bg-gradient-to-r from-app-blue/10 to-app-teal/10">
            <CardTitle className="text-xl flex items-center gap-2">
              <BookText className="h-5 w-5 text-app-blue" />
              Govorno-jezikovne vaje
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground italic"></p>
            <p className="mt-2 my-0">Prilagojene aktivnosti za izboljšanje otrokove izgovorjave.</p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-app-blue hover:bg-app-blue/90"
              onClick={handleGoToExercises}
            >
              Pojdi na vaje
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader className="bg-gradient-to-r from-app-purple/10 to-app-blue/10">
            <CardTitle className="text-xl flex items-center gap-2">
              <Gamepad className="h-5 w-5 text-app-purple" />
              Vaje za jezik
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p>
              Vadba za mišice jezika z zabavnimi vajami.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-app-purple hover:bg-app-purple/90"
              onClick={handleGoToTongueGym}
            >
              Začni vaje
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="transition-all duration-300 hover:shadow-md h-full flex flex-col">
          <CardHeader className="bg-gradient-to-r from-app-purple/10 to-app-teal/10">
            <CardTitle className="text-xl flex items-center gap-2">
              <TestTube className="h-5 w-5 text-app-purple" />
              Artikulacijski test
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex-grow">
            <p>
              Test izgovorjave za vse slovenske soglasnike.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-[#9b87f5] hover:bg-[#8B5CF6]"
              onClick={handleGoToArticulationTest}
            >
              Začni test
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="transition-all duration-300 hover:shadow-md h-full flex flex-col">
          <CardHeader className="bg-gradient-to-r from-app-orange/10 to-app-yellow/10">
            <CardTitle className="text-xl flex items-center gap-2">
              <Zap className="h-5 w-5 text-app-orange" />
              Moji izzivi
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex-grow">
            <p>
              Izberi, s katero izgovorjavo imaš težave in prejmi prilagojene vaje.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-app-orange hover:bg-app-orange/90">
              Izberi težavo
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="transition-all duration-300 hover:shadow-md h-full flex flex-col">
          <CardHeader className="bg-gradient-to-r from-app-teal/10 to-dragon-green/10">
            <CardTitle className="text-xl flex items-center gap-2">
              <Video className="h-5 w-5 text-app-teal" />
              Video navodila
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex-grow">
            <p>
              Poglej kako logoped pravilno izgovori posamezne črke.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-app-teal hover:bg-app-teal/90">
              Poglej video
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
