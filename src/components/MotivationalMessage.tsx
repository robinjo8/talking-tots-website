
import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const motivationalMessages = [
  "Tvoj glas je poseben – vadimo ga skupaj, korak za korakom!",
  "Vsaka beseda, ki jo izgovoriš, je pogumen korak naprej!",
  "Tudi Zmajček Tomi trenira – vaja dela mojstra, tudi pri govorjenju!",
  "Tudi če se zatakneš, si pogumen: Kar tako naprej!",
  "Tvoj glas je pomemben – ponovi ga s ponosom!",
  "Vsak glas, ki ga izgovoriš, je zmaga za tvoje besede!",
  "Napaka ni napaka – je samo vaja za naslednji uspeh!",
  "Tvoj trud pri govorjenju je super moč – z njo rasteš vsak dan!",
  "Skupaj bova ujela vse črke – eno za drugo!",
  "Tudi, če gre počasi, greš naprej – in to je super!",
  "Vadiva skupaj – črka po črko, počasi in lepo.",
  "Ni ti treba znati vsega takoj – jaz sem tu, da ti pomagam.",
  "Vsaka vaja je lažja, ko jo delava skupaj.",
  "Z mojo pomočjo lahko najdeva vse črke!"
];

export function MotivationalMessage() {
  const [message, setMessage] = useState("");
  
  useEffect(() => {
    // Select a random message on component mount
    const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
    setMessage(motivationalMessages[randomIndex]);
  }, []);
  
  return (
    <Card className="mb-8 bg-gradient-to-r from-sky-50 to-green-50 border-dragon-green/30 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl md:text-2xl text-dragon-green">
          <MessageSquare className="h-5 w-5 text-dragon-green" />
          Zmajček Tomi ti sporoča:
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2 flex items-center gap-4">
        <div className="hidden sm:block w-20 h-20">
          <img 
            src="/lovable-uploads/4377ec70-1996-47a9-bf05-8093cffcaf0b.png" 
            alt="Zmajček Tomi" 
            className="w-full h-full object-contain animate-bounce-gentle"
          />
        </div>
        <div className="flex-1">
          <p className="text-lg font-medium italic">{message}</p>
          <p className="text-sm text-muted-foreground mt-2">Z vajami postajamo vedno boljši!</p>
        </div>
      </CardContent>
    </Card>
  );
}
