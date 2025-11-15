import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import useEmblaCarousel from "embla-carousel-react";
import { useIsMobile } from "@/hooks/use-mobile";

const sequenceGames = [
  {
    id: "zaporedja-c",
    letter: "C",
    gradient: "from-dragon-green/20 to-dragon-green/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_C.png",
    description: "Uredi zaporedje besed s črko C",
    available: true
  },
  {
    id: "zaporedja-č",
    letter: "Č",
    gradient: "from-app-blue/20 to-app-teal/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_CH.png",
    description: "Uredi zaporedje besed s črko Č",
    available: true
  },
  {
    id: "zaporedja-k",
    letter: "K",
    gradient: "from-app-orange/20 to-app-yellow/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_K.png",
    description: "Uredi zaporedje besed s črko K",
    available: true
  },
  {
    id: "zaporedja-l",
    letter: "L",
    gradient: "from-app-purple/20 to-app-blue/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_L.png",
    description: "Uredi zaporedje besed s črko L",
    available: true
  },
  {
    id: "zaporedja-r",
    letter: "R",
    gradient: "from-app-purple/20 to-app-teal/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_R.png",
    description: "Uredi zaporedje besed s črko R",
    available: true
  },
  {
    id: "zaporedja-s",
    letter: "S",
    gradient: "from-dragon-green/20 to-app-teal/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_S.png",
    description: "Uredi zaporedje besed s črko S",
    available: true
  },
  {
    id: "zaporedja-š",
    letter: "Š",
    gradient: "from-app-blue/20 to-app-purple/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_SH.png",
    description: "Uredi zaporedje besed s črko Š",
    available: true
  },
  {
    id: "zaporedja-z",
    letter: "Z",
    gradient: "from-app-teal/20 to-dragon-green/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_Z.png",
    description: "Uredi zaporedje besed s črko Z",
    available: true
  },
  {
    id: "zaporedja-ž",
    letter: "Ž",
    gradient: "from-app-purple/20 to-app-blue/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_ZH.png",
    description: "Uredi zaporedje besed s črko Ž",
    available: true
  }
];

export default function Zaporedja() {
  const navigate = useNavigate();
  const { selectedChild } = useAuth();
  const childName = selectedChild?.name;
  const isMobile = useIsMobile();
  const [emblaRef] = useEmblaCarousel({ 
    align: 'start',
    dragFree: true,
    containScroll: 'trimSnaps'
  });

  const handleCardClick = (game: typeof sequenceGames[0]) => {
    if (!game.available) return;
    
    // TODO: Add navigation when we create individual letter pages
    console.log(`Navigating to ${game.letter} sequence game`);
  };

  const LetterCard = ({ game }: { game: typeof sequenceGames[0] }) => (
    <div
      key={game.id}
      onClick={() => handleCardClick(game)}
      className={`${
        isMobile ? "embla__slide min-w-[280px] mr-4" : ""
      } bg-card rounded-xl shadow-md hover:shadow-xl transition-all duration-300 ${
        game.available ? "cursor-pointer" : "opacity-60 cursor-not-allowed"
      } overflow-hidden group`}
    >
      <div className={`relative aspect-video overflow-hidden bg-gradient-to-br ${game.gradient}`}>
        <div className="w-full h-full flex items-center justify-center p-4">
          <img 
            src={game.image}
            alt={game.letter}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
          />
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-foreground mb-2 text-center group-hover:text-app-blue transition-colors">
          {game.letter}
        </h3>
        <p className="text-sm text-muted-foreground text-center">
          {game.description}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-6xl mx-auto pt-28 md:pt-32 pb-20 px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            Zaporedja
          </h1>
          <div className="w-32 h-1 bg-app-yellow mx-auto rounded-full mb-8"></div>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-2 border-border/50 mb-12">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl text-foreground">
              <MessageSquare className="w-5 h-5 text-app-blue" />
              {childName ? `Pozdravljeni, ${childName}!` : 'Pozdravljeni!'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Izberi črko in igraj zaporedja - uredi slike v pravem vrstnem redu in vadi izgovorjavo.
            </p>
          </CardContent>
        </Card>

        {isMobile ? (
          <div className="embla overflow-hidden" ref={emblaRef}>
            <div className="embla__container flex">
              {sequenceGames.map((game) => (
                <LetterCard key={game.id} game={game} />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sequenceGames.map((game) => (
              <LetterCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
