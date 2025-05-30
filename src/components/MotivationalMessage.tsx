
import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";

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
  "Vadiva skupaj – črka po črka, počasi in lepo.",
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
    <div className="mb-8 p-4 bg-white/60 backdrop-blur-sm border border-dragon-green/20 rounded-xl shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-dragon-green/10 rounded-full flex items-center justify-center">
          <MessageSquare className="h-4 w-4 text-dragon-green" />
        </div>
        <h3 className="text-base font-semibold text-dragon-green">
          Zmajček Tomi ti sporoča:
        </h3>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden sm:block w-12 h-12 flex-shrink-0">
          <img 
            src="/lovable-uploads/4377ec70-1996-47a9-bf05-8093cffcaf0b.png" 
            alt="Zmajček Tomi" 
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium italic text-gray-700 mb-1">{message}</p>
          <p className="text-xs text-muted-foreground">Z vajami postajamo vedno boljši!</p>
        </div>
      </div>
    </div>
  );
}
