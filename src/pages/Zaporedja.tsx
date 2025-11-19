import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import useEmblaCarousel from "embla-carousel-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";

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
    
    const letterMap: Record<string, string> = {
      'C': '/govorne-igre/zaporedja/c'
    };
    
    const path = letterMap[game.letter];
    if (path) {
      navigate(path);
    }
  };

  const LetterCard = ({ game }: { game: typeof sequenceGames[0] }) => (
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
                {sequenceGames.map(game => (
                  <div key={game.id} className="flex-[0_0_85%] min-w-0">
                    <LetterCard game={game} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Desktop: Grid layout */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sequenceGames.map(game => (
                <LetterCard key={game.id} game={game} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
