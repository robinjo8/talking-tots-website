import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getAgeGroup } from "@/utils/ageUtils";
import useEmblaCarousel from "embla-carousel-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";

const memoryGames = [
  {
    id: "drsna-sestavljanka-c",
    letter: "C",
    gradient: "from-dragon-green/20 to-dragon-green/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_C.png",
    description: "Drsna sestavljanka s črko C in nato glasno ponovi besedo",
    available: true
  },
  {
    id: "drsna-sestavljanka-č",
    letter: "Č",
    gradient: "from-app-blue/20 to-app-teal/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_CH.png",
    description: "Drsna sestavljanka s črko Č in nato glasno ponovi besedo",
    available: true
  },
  {
    id: "drsna-sestavljanka-k",
    letter: "K",
    gradient: "from-app-orange/20 to-app-yellow/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_K.png",
    description: "Drsna sestavljanka s črko K in nato glasno ponovi besedo",
    available: true
  },
  {
    id: "drsna-sestavljanka-l",
    letter: "L",
    gradient: "from-app-purple/20 to-app-blue/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_L.png",
    description: "Drsna sestavljanka s črko L in nato glasno ponovi besedo",
    available: true
  },
  {
    id: "drsna-sestavljanka-r",
    letter: "R",
    gradient: "from-app-purple/20 to-app-teal/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_R.png",
    description: "Drsna sestavljanka s črko R in nato glasno ponovi besedo",
    available: true
  },
  {
    id: "drsna-sestavljanka-s",
    letter: "S",
    gradient: "from-dragon-green/20 to-app-teal/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_S.png",
    description: "Drsna sestavljanka s črko S in nato glasno ponovi besedo",
    available: true
  },
  {
    id: "drsna-sestavljanka-š",
    letter: "Š",
    gradient: "from-app-blue/20 to-app-purple/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_SH.png",
    description: "Drsna sestavljanka s črko Š in nato glasno ponovi besedo",
    available: true
  },
  {
    id: "drsna-sestavljanka-z",
    letter: "Z",
    gradient: "from-app-teal/20 to-dragon-green/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_Z.png",
    description: "Drsna sestavljanka s črko Z in nato glasno ponovi besedo",
    available: true
  },
  {
    id: "drsna-sestavljanka-ž",
    letter: "Ž",
    gradient: "from-app-purple/20 to-app-blue/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_ZH.png",
    description: "Drsna sestavljanka s črko Ž in nato glasno ponovi besedo",
    available: true
  }
];

export default function DrsnaSestavljanka() {
  const navigate = useNavigate();
  const { selectedChild } = useAuth();
  const childName = selectedChild?.name;
  const isMobile = useIsMobile();
  const [emblaRef] = useEmblaCarousel({ 
    align: 'start',
    dragFree: true,
    containScroll: 'trimSnaps'
  });

  const handleCardClick = (game: typeof memoryGames[0]) => {
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
        targetRoute = `/govorne-igre/drsna-sestavljanka/${game.letter.toLowerCase()}`;
        break;
      case '5-6':
        targetRoute = `/govorne-igre/drsna-sestavljanka/${game.letter.toLowerCase()}56`;
        break;
      case '7-8':
        targetRoute = `/govorne-igre/drsna-sestavljanka/${game.letter.toLowerCase()}78`;
        break;
      case '9-10':
        targetRoute = `/govorne-igre/drsna-sestavljanka/${game.letter.toLowerCase()}910`;
        break;
      default:
        targetRoute = `/govorne-igre/drsna-sestavljanka/${game.letter.toLowerCase()}`;
    }
    
    navigate(targetRoute);
  };

  const LetterCard = ({ game }: { game: typeof memoryGames[0] }) => (
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
      
      <div className="container max-w-5xl mx-auto pt-20 md:pt-24 pb-20 px-4">
        {/* Instruction speech-bubble */}
        <Card className="mb-8 bg-gradient-to-r from-sky-50 to-green-50 border-dragon-green/30 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-xl md:text-2xl text-dragon-green">
                <MessageSquare className="h-5 w-5 text-dragon-green" />
                HEJ, {childName?.toUpperCase() || "TIAN"}!
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
                <p className="text-lg font-medium italic">IZBERI ČRKO IN POMAGAJ TOMIJU SESTAVITI DRSNO SESTAVLJANKO. NA KONCU PA SKUPAJ GLASNO PONOVITA BESEDO!</p>
                <p className="text-sm text-muted-foreground mt-2">Z VAJAMI POSTAJAMO VEDNO BOLJŠI!</p>
              </div>
            </CardContent>
        </Card>

        {/* Breadcrumb - Desktop only */}
        <div className="hidden lg:block mb-8">
          <BreadcrumbNavigation />
        </div>

        {/* Letters grid/carousel */}
        <div className="mb-12">
          {isMobile ? (
            /* Mobile: Horizontal scroll carousel */
            <div className="overflow-hidden -mx-4" ref={emblaRef}>
              <div className="flex gap-4 px-4">
                {memoryGames.map(game => (
                  <div key={game.id} className="flex-[0_0_85%] min-w-0">
                    <LetterCard game={game} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Desktop: Grid layout */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {memoryGames.map(game => (
                <LetterCard key={game.id} game={game} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
