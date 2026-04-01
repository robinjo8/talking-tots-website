import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import useEmblaCarousel from "embla-carousel-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { DailyStarsBar } from "@/components/DailyStarsBar";
import { FooterSection } from "@/components/FooterSection";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const SUPABASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co";
const backgroundImageUrl = `${SUPABASE_URL}/storage/v1/object/public/ozadja/ozadje_1.jpg`;

const memoryGames = [
  { id: "spomin-c", letter: "C", gradient: "from-dragon-green/20 to-dragon-green/20", image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_C.png", description: "Poišči pare slik z glasom C in nato ponovi besedo", path: "/govorne-igre/spomin/spomin-c", available: true },
  { id: "spomin-ch", letter: "Č", gradient: "from-app-blue/20 to-app-teal/20", image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_CH.png", description: "Poišči pare slik z glasom Č in nato ponovi besedo", path: "/govorne-igre/spomin/spomin-ch", available: true },
  { id: "spomin-f", letter: "F", gradient: "from-app-orange/20 to-app-yellow/20", image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_F.webp", description: "Poišči pare slik z glasom F in nato ponovi besedo", path: "/govorne-igre/spomin/spomin-f", available: true },
  { id: "spomin-g", letter: "G", gradient: "from-dragon-green/20 to-app-teal/20", image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_G.webp", description: "Poišči pare slik z glasom G in nato ponovi besedo", path: "/govorne-igre/spomin/spomin-g", available: true },
  { id: "spomin-h", letter: "H", gradient: "from-app-blue/20 to-app-purple/20", image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_H.webp", description: "Poišči pare slik z glasom H in nato ponovi besedo", path: "/govorne-igre/spomin/spomin-h", available: true },
  { id: "spomin-k", letter: "K", gradient: "from-app-orange/20 to-app-yellow/20", image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_K.png", description: "Poišči pare slik z glasom K in nato ponovi besedo", path: "/govorne-igre/spomin/spomin-k", available: true },
  { id: "spomin-l", letter: "L", gradient: "from-app-purple/20 to-app-blue/20", image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_L.png", description: "Poišči pare slik z glasom L in nato ponovi besedo", path: "/govorne-igre/spomin/spomin-l", available: true },
  { id: "spomin-r-zacetek", letter: "R", gradient: "from-app-purple/20 to-app-teal/20", image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_R.png", description: "Poišči pare slik z glasom R in nato ponovi besedo - začetne vaje", path: "/govorne-igre/spomin/spomin-r-zacetek", available: true },
  { id: "spomin-r", letter: "R", gradient: "from-app-purple/20 to-app-teal/20", image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_R.png", description: "Poišči pare slik z glasom R in nato ponovi besedo", path: "/govorne-igre/spomin/spomin-r", available: true },
  { id: "spomin-s", letter: "S", gradient: "from-dragon-green/20 to-app-teal/20", image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_S.png", description: "Poišči pare slik z glasom S in nato ponovi besedo", path: "/govorne-igre/spomin/spomin-s", available: true },
  { id: "spomin-sh", letter: "Š", gradient: "from-app-blue/20 to-app-purple/20", image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_SH.png", description: "Poišči pare slik z glasom Š in nato ponovi besedo", path: "/govorne-igre/spomin/spomin-sh", available: true },
  { id: "spomin-v", letter: "V", gradient: "from-app-purple/20 to-app-teal/20", image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_V.webp", description: "Poišči pare slik z glasom V in nato ponovi besedo", path: "/govorne-igre/spomin/spomin-v", available: true },
  { id: "spomin-z", letter: "Z", gradient: "from-app-teal/20 to-dragon-green/20", image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_Z.png", description: "Poišči pare slik z glasom Z in nato ponovi besedo", path: "/govorne-igre/spomin/spomin-z", available: true },
  { id: "spomin-zh", letter: "Ž", gradient: "from-app-purple/20 to-app-blue/20", image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_ZH.png", description: "Poišči pare slik z glasom Ž in nato ponovi besedo", path: "/govorne-igre/spomin/spomin-zh", available: true },
];
export default function SpominGames() {
  const navigate = useNavigate();
  const { user, selectedChild, signOut } = useAuth();
  const childName = selectedChild?.name;
  const isMobile = useIsMobile();
  const [emblaRef] = useEmblaCarousel({ 
    align: 'start',
    dragFree: true,
    containScroll: 'trimSnaps'
  });

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = "/login";
    } catch (error) {
      console.error("Error in SpominGames handleSignOut:", error);
      toast.error("Napaka pri odjavi");
    }
  };

  const handleLetterClick = (game: typeof memoryGames[0]) => {
    navigate(game.path);
  };

  const LetterCard = ({ game }: { game: typeof memoryGames[0] }) => (
    <div
      className="bg-card rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group border border-gray-200"
      onClick={() => handleLetterClick(game)}
    >
      {/* Card Image */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${game.gradient} ${isMobile ? 'aspect-[4/3]' : 'aspect-video'}`}>
        <div className="w-full h-full flex items-center justify-center">
          <img 
            src={game.image}
            alt={`Glas ${game.letter}`}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
            style={{ mixBlendMode: 'multiply' }}
          />
        </div>
      </div>

      {/* Card Content */}
      <div className={isMobile ? "p-1.5 text-center" : "p-6"}>
        <h3 className={isMobile 
          ? "text-xs font-bold text-foreground group-hover:text-app-blue transition-colors leading-tight" 
          : "text-xl font-bold text-foreground mb-3 group-hover:text-app-blue transition-colors"
        }>
          {game.id === 'spomin-r-zacetek' ? 'Glas R - začetne vaje' : `Glas ${game.letter}`}
        </h3>
        {!isMobile && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {game.description}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Mobile Back Button */}
      {isMobile && (
        <button
          onClick={() => navigate("/govorne-igre")}
          className="fixed bottom-4 left-4 z-50 rounded-full w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg border-2 border-white/50 backdrop-blur-sm flex items-center justify-center transition-all"
        >
          <ArrowLeft className="w-7 h-7 text-white" />
        </button>
      )}
      
      {/* Hero sekcija */}
      <section className="bg-dragon-green py-12 md:py-16 pt-24 md:pt-28">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Spomin
            </h1>
            <p className="text-xl text-white/90">
              Izberi glas za igro spomina
            </p>
          </div>
          
          <DailyStarsBar />
        </div>
      </section>
      
      {/* Bela sekcija */}
      <section 
        className="py-4 md:py-12 bg-white min-h-screen" 
        style={{ backgroundColor: 'white' }}
      >
        <div className="container max-w-6xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="hidden md:block mb-8">
            <BreadcrumbNavigation />
          </div>
          
          {/* Letters grid */}
          <div className="mb-4 md:mb-12">
            {isMobile ? (
              /* Mobile: 3-column grid */
              <div className="grid grid-cols-3 gap-2">
                {memoryGames.map(game => (
                  <LetterCard key={game.id} game={game} />
                ))}
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
      </section>
      
      <FooterSection handleSignOut={handleSignOut} />
    </div>
  );
}
