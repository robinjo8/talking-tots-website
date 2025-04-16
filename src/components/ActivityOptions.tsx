import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookText, Gamepad, Zap, Video } from "lucide-react";

export function ActivityOptions() {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4 mt-12 text-dragon-green">
        Govorno-jezikovne vaje
      </h2>
      <p className="text-muted-foreground mb-6 max-w-2xl mx-auto text-center">
        Prilagojene aktivnosti za izboljšanje otrokove izgovorjave.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader className="bg-gradient-to-r from-app-blue/10 to-app-teal/10">
            <CardTitle className="text-xl flex items-center gap-2">
              <BookText className="h-5 w-5 text-app-blue" />
              Vaje za govor
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p>
              Izberi črko, ki jo želiš vaditi (C, Č, K, L, R, S, Š, Z, Ž,...).
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-app-blue hover:bg-app-blue/90">
              Pojdi na vaje
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="transition-all duration-300 hover:shadow-md">
          <CardHeader className="bg-gradient-to-r from-app-purple/10 to-app-blue/10">
            <CardTitle className="text-xl flex items-center gap-2">
              <Gamepad className="h-5 w-5 text-app-purple" />
              Govorne igre
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <p>
              Zabavne igre za izboljšanje izgovorjave.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-app-purple hover:bg-app-purple/90">
              Začni igro
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
