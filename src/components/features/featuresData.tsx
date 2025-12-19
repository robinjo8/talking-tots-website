
import { Stars, Volume2, Zap, Book, Award } from "lucide-react";

export const features = [
  {
    icon: <Book className="h-8 w-8 md:h-10 md:w-10 text-white" />,
    title: "Podprto s strani logopedov",
    description: "Razvito v sodelovanju s profesionalnimi logopedi",
    color: "bg-gradient-to-br from-dragon-green to-dragon-green/80"
  },
  {
    icon: <Stars className="h-8 w-8 md:h-10 md:w-10 text-white" />,
    title: "Zabavne aktivnosti",
    description: "Privlačne igre, ki naredijo učenje govora prijetno",
    color: "bg-gradient-to-br from-app-purple to-app-purple/80"
  },
  {
    icon: <Volume2 className="h-8 w-8 md:h-10 md:w-10 text-white" />,
    title: "Vodnik za izgovorjavo",
    description: "Jasni avdio primeri pravilne izgovorjave besed",
    color: "bg-gradient-to-br from-app-teal to-app-teal/80"
  },
  {
    icon: <Zap className="h-8 w-8 md:h-10 md:w-10 text-white" />,
    title: "Sledenje napredku",
    description: "Spremljajte izboljšanje vašega otroka skozi čas",
    color: "bg-gradient-to-br from-app-yellow to-app-yellow/80"
  },
  {
    icon: <Award className="h-8 w-8 md:h-10 md:w-10 text-white" />,
    title: "Sistem nagrajevanja",
    description: "Pridobivajte zvezdice in odklepajte nove zmajčke",
    color: "bg-gradient-to-br from-app-blue to-app-teal"
  }
];
