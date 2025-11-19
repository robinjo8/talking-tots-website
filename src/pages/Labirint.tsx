import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import AnimatedBackground from "@/components/AnimatedBackground";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import useEmblaCarousel from "embla-carousel-react";
import { Card, CardContent } from "@/components/ui/card";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";

const labirintGames = [
  {
    id: "c",
    letter: "C",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_C.png",
    gradient: "from-dragon-green/20 to-dragon-green/20",
    description: "Poišči pot skozi labirint s črko C",
    available: true
  },
  {
    id: "č",
    letter: "Č",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_CH.png",
    gradient: "from-app-blue/20 to-app-teal/20",
    description: "Poišči pot skozi labirint s črko Č",
    available: false
  },
  {
    id: "k",
    letter: "K",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_K.png",
    gradient: "from-app-orange/20 to-app-yellow/20",
    description: "Poišči pot skozi labirint s črko K",
    available: false
  },
  {
    id: "l",
    letter: "L",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_L.png",
    gradient: "from-app-purple/20 to-app-blue/20",
    description: "Poišči pot skozi labirint s črko L",
    available: false
  },
  {
    id: "r",
    letter: "R",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_R.png",
    gradient: "from-app-purple/20 to-app-teal/20",
    description: "Poišči pot skozi labirint s črko R",
    available: false
  },
  {
    id: "s",
    letter: "S",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_S.png",
    gradient: "from-dragon-green/20 to-app-teal/20",
    description: "Poišči pot skozi labirint s črko S",
    available: false
  },
  {
    id: "š",
    letter: "Š",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_SH.png",
    gradient: "from-app-blue/20 to-app-purple/20",
    description: "Poišči pot skozi labirint s črko Š",
    available: false
  },
  {
    id: "z",
    letter: "Z",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_Z.png",
    gradient: "from-app-teal/20 to-dragon-green/20",
    description: "Poišči pot skozi labirint s črko Z",
    available: false
  },
  {
    id: "ž",
    letter: "Ž",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_ZH.png",
    gradient: "from-app-purple/20 to-app-blue/20",
    description: "Poišči pot skozi labirint s črko Ž",
    available: false
  }
];

export default function Labirint() {
  const navigate = useNavigate();
  const { selectedChild } = useAuth();
  const isMobile = useIsMobile();
  const [emblaRef] = useEmblaCarousel({ 
    align: "start",
    containScroll: "trimSnaps"
  });

  const handleCardClick = (game: typeof labirintGames[0]) => {
    if (!game.available) return;

    const childAge = selectedChild?.age || 5;
    let route = "";

    if (childAge >= 3 && childAge <= 4) {
      route = `/govorne-igre/labirint/${game.id}`;
    } else if (childAge >= 5 && childAge <= 6) {
      route = `/govorne-igre/labirint/${game.id}`;
    } else if (childAge >= 7 && childAge <= 8) {
      route = `/govorne-igre/labirint/${game.id}`;
    } else if (childAge >= 9) {
      route = `/govorne-igre/labirint/${game.id}`;
    }

    if (route) {
      navigate(route);
    }
  };

  const LetterCard = ({ game }: { game: typeof labirintGames[0] }) => (
    <Card
      className={`group relative overflow-hidden transition-all duration-300 ${
        game.available
          ? "hover:shadow-2xl hover:scale-105 cursor-pointer"
          : "opacity-60 cursor-not-allowed"
      }`}
      onClick={() => handleCardClick(game)}
    >
      <CardContent className="p-0">
        <div className={`relative aspect-square bg-gradient-to-br ${game.gradient}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={game.image}
              alt={`Zmajček ${game.letter}`}
              className="w-3/4 h-3/4 object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="absolute top-4 right-4">
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
              <span className="text-4xl font-bold text-foreground">{game.letter}</span>
            </div>
          </div>
          {!game.available && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
              <span className="text-white text-2xl font-bold">KMALU</span>
            </div>
          )}
        </div>
        <div className="p-6 bg-card">
          <p className="text-center text-sm text-muted-foreground leading-relaxed">
            {game.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <Header />
      
      <div className="container max-w-7xl mx-auto pt-28 md:pt-32 pb-20 px-4">
        {/* Breadcrumb - Desktop only */}
        <div className="hidden lg:block mb-6">
          <BreadcrumbNavigation />
        </div>

        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            Izberi črko za igro
          </h1>
          <div className="w-32 h-1 bg-app-yellow mx-auto rounded-full"></div>
        </div>

        {/* Desktop Grid */}
        {!isMobile && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {labirintGames.map((game) => (
              <LetterCard key={game.id} game={game} />
            ))}
          </div>
        )}

        {/* Mobile Carousel */}
        {isMobile && (
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 pb-4">
              {labirintGames.map((game) => (
                <div key={game.id} className="flex-[0_0_80%] min-w-0">
                  <LetterCard game={game} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
