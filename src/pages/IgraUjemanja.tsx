import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getAgeGroup } from "@/utils/ageUtils";
import useEmblaCarousel from "embla-carousel-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";

const matchingGames = [
  {
    id: "igra-ujemanja-c",
    letter: "C",
    gradient: "from-dragon-green/20 to-dragon-green/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_C.png",
    description: "Poveži besedo s črko C s pravo sliko",
    available: true
  },
  {
    id: "igra-ujemanja-č",
    letter: "Č",
    gradient: "from-app-blue/20 to-app-teal/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_CH.png",
    description: "Poveži besedo s črko Č s pravo sliko",
    available: true
  },
  {
    id: "igra-ujemanja-k",
    letter: "K",
    gradient: "from-app-orange/20 to-app-yellow/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_K.png",
    description: "Poveži besedo s črko K s pravo sliko",
    available: true
  },
  {
    id: "igra-ujemanja-l",
    letter: "L",
    gradient: "from-app-purple/20 to-app-blue/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_L.png",
    description: "Poveži besedo s črko L s pravo sliko",
    available: true
  },
  {
    id: "igra-ujemanja-r",
    letter: "R",
    gradient: "from-app-purple/20 to-app-teal/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_R.png",
    description: "Poveži besedo s črko R s pravo sliko",
    available: true
  },
  {
    id: "igra-ujemanja-s",
    letter: "S",
    gradient: "from-dragon-green/20 to-app-teal/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_S.png",
    description: "Poveži besedo s črko S s pravo sliko",
    available: true
  },
  {
    id: "igra-ujemanja-š",
    letter: "Š",
    gradient: "from-app-blue/20 to-app-purple/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_SH.png",
    description: "Poveži besedo s črko Š s pravo sliko",
    available: true
  },
  {
    id: "igra-ujemanja-z",
    letter: "Z",
    gradient: "from-app-teal/20 to-dragon-green/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_Z.png",
    description: "Poveži besedo s črko Z s pravo sliko",
    available: true
  },
  {
    id: "igra-ujemanja-ž",
    letter: "Ž",
    gradient: "from-app-purple/20 to-app-blue/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_ZH.png",
    description: "Poveži besedo s črko Ž s pravo sliko",
    available: true
  }
];

export default function IgraUjemanja() {
  const navigate = useNavigate();
  const { selectedChild } = useAuth();
  const childName = selectedChild?.name;
  const isMobile = useIsMobile();
  const [emblaRef] = useEmblaCarousel({ 
    align: 'start',
    dragFree: true,
    containScroll: 'trimSnaps'
  });

  const handleCardClick = (game: typeof matchingGames[0]) => {
    if (!game.available) return;
    
    if (!selectedChild?.age) {
      navigate('/profile');
      return;
    }
    
    const childAge = selectedChild.age;
    const ageGroup = getAgeGroup(childAge);
    
    let targetRoute = '';
    switch (ageGroup) {
      case '3-4':
        targetRoute = `/govorne-igre/igra-ujemanja/${game.letter.toLowerCase()}`;
        break;
      case '5-6':
        targetRoute = `/govorne-igre/igra-ujemanja/${game.letter.toLowerCase()}56`;
        break;
      case '7-8':
        targetRoute = `/govorne-igre/igra-ujemanja/${game.letter.toLowerCase()}78`;
        break;
      case '9-10':
        targetRoute = `/govorne-igre/igra-ujemanja/${game.letter.toLowerCase()}910`;
        break;
      default:
        targetRoute = `/govorne-igre/igra-ujemanja/${game.letter.toLowerCase()}`;
    }
    
    navigate(targetRoute);
  };

  const LetterCard = ({ game }: { game: typeof matchingGames[0] }) => (
    <div
      className="bg-card rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group border border-gray-200"
      onClick={() => handleCardClick(game)}
    >
      {/* Card Image */}
      <div className={`relative aspect-video overflow-hidden bg-gradient-to-br ${game.gradient}`}>
        <div className="w-full h-full flex items-center justify-center">
          <img 
            src={game.image}
            alt={`Črka ${game.letter}`}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
            style={{ mixBlendMode: 'multiply' }}
          />
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-app-blue transition-colors">
          Črka {game.letter}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {game.description}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-6xl mx-auto pt-28 md:pt-32 pb-20 px-4">
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

        {/* Letters grid/carousel */}
        <div className="mb-12">
          {isMobile ? (
            /* Mobile: Horizontal scroll carousel */
            <div className="overflow-hidden -mx-4" ref={emblaRef}>
              <div className="flex gap-4 px-4">
                {matchingGames.map(game => (
                  <div key={game.id} className="flex-[0_0_85%] min-w-0">
                    <LetterCard game={game} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Desktop: Grid layout */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {matchingGames.map(game => (
                <LetterCard key={game.id} game={game} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
