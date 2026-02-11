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

// Use ASCII-safe URL keys for Slovenian diacritics (č→ch, š→sh, ž→zh)
const labirintGames = [
  {
    id: "c",
    letter: "C",
    gradient: "from-dragon-green/20 to-dragon-green/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_C.png",
    description: "Poišči pot skozi labirint s črko C",
    path: "/govorne-igre/labirint/c",
    available: true
  },
  {
    id: "č",
    letter: "Č",
    gradient: "from-app-blue/20 to-app-teal/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_CH.png",
    description: "Poišči pot skozi labirint s črko Č",
    path: "/govorne-igre/labirint/ch",
    available: true
  },
  {
    id: "k",
    letter: "K",
    gradient: "from-app-orange/20 to-app-yellow/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_K.png",
    description: "Poišči pot skozi labirint s črko K",
    path: "/govorne-igre/labirint/k",
    available: true
  },
  {
    id: "l",
    letter: "L",
    gradient: "from-app-purple/20 to-app-blue/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_L.png",
    description: "Poišči pot skozi labirint s črko L",
    path: "/govorne-igre/labirint/l",
    available: true
  },
  {
    id: "r",
    letter: "R",
    gradient: "from-app-purple/20 to-app-teal/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_R.png",
    description: "Poišči pot skozi labirint s črko R",
    path: "/govorne-igre/labirint/r",
    available: true
  },
  {
    id: "s",
    letter: "S",
    gradient: "from-dragon-green/20 to-app-teal/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_S.png",
    description: "Poišči pot skozi labirint s črko S",
    path: "/govorne-igre/labirint/s",
    available: true
  },
  {
    id: "š",
    letter: "Š",
    gradient: "from-app-blue/20 to-app-purple/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_SH.png",
    description: "Poišči pot skozi labirint s črko Š",
    path: "/govorne-igre/labirint/sh",
    available: true
  },
  {
    id: "z",
    letter: "Z",
    gradient: "from-app-teal/20 to-dragon-green/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_Z.png",
    description: "Poišči pot skozi labirint s črko Z",
    path: "/govorne-igre/labirint/z",
    available: true
  },
  {
    id: "ž",
    letter: "Ž",
    gradient: "from-app-purple/20 to-app-blue/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_ZH.png",
    description: "Poišči pot skozi labirint s črko Ž",
    path: "/govorne-igre/labirint/zh",
    available: true
  }
];

export default function Labirint() {
  const navigate = useNavigate();
  const { selectedChild, signOut } = useAuth();
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = "/login";
    } catch (error) {
      console.error("Error in Labirint handleSignOut:", error);
      toast.error("Napaka pri odjavi");
    }
  };

  const handleLetterClick = (game: typeof labirintGames[0]) => {
    navigate(game.path);
  };

  const LetterCard = ({ game }: { game: typeof labirintGames[0] }) => (
    <div
      className="bg-card rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group border border-gray-200"
      onClick={() => handleLetterClick(game)}
    >
      {/* Card Image */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${game.gradient} ${isMobile ? 'aspect-square' : 'aspect-video'}`}>
        <div className="w-full h-full flex items-center justify-center">
          <img 
            src={game.image}
            alt={`Črka ${game.letter}`}
            className={`object-contain group-hover:scale-110 transition-transform duration-300 ${isMobile ? 'w-[80%] h-[80%]' : 'w-full h-full'}`}
            style={{ mixBlendMode: 'multiply' }}
          />
        </div>
      </div>

      {/* Card Content */}
      <div className={`p-6 ${isMobile ? 'text-center' : ''}`}>
        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-app-blue transition-colors">
          Črka {game.letter}
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
        <Button
          onClick={() => navigate("/govorne-igre")}
          className="fixed bottom-6 left-6 z-50 h-14 w-14 rounded-full bg-app-orange hover:bg-app-orange/90 shadow-lg"
          size="icon"
        >
          <ArrowLeft className="h-6 w-6 text-white" />
        </Button>
      )}
      
      {/* Hero sekcija */}
      <section className="bg-dragon-green py-12 md:py-16 pt-24 md:pt-28">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Labirint
            </h1>
            <p className="text-xl text-white/90">
              Izberi črko in poišči pot skozi labirint
            </p>
          </div>
          
          <DailyStarsBar />
        </div>
      </section>
      
      {/* Bela sekcija */}
      <section 
        className="py-12 bg-white min-h-screen" 
        style={{ backgroundColor: 'white' }}
      >
        <div className="container max-w-6xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-8">
            <BreadcrumbNavigation />
          </div>
          
          {/* Letters grid */}
          <div className="mb-12">
            {isMobile ? (
              /* Mobile: 2-column grid */
              <div className="grid grid-cols-2 gap-4">
                {labirintGames.map(game => (
                  <LetterCard key={game.id} game={game} />
                ))}
              </div>
            ) : (
              /* Desktop: Grid layout */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {labirintGames.map(game => (
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
