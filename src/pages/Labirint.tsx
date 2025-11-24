import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import useEmblaCarousel from "embla-carousel-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { Progress } from "@/components/ui/progress";
import { useDailyProgress } from "@/hooks/useDailyProgress";
import { FooterSection } from "@/components/FooterSection";
import { toast } from "sonner";

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
    path: "/govorne-igre/labirint/č",
    available: false
  },
  {
    id: "k",
    letter: "K",
    gradient: "from-app-orange/20 to-app-yellow/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_K.png",
    description: "Poišči pot skozi labirint s črko K",
    path: "/govorne-igre/labirint/k",
    available: false
  },
  {
    id: "l",
    letter: "L",
    gradient: "from-app-purple/20 to-app-blue/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_L.png",
    description: "Poišči pot skozi labirint s črko L",
    path: "/govorne-igre/labirint/l",
    available: false
  },
  {
    id: "r",
    letter: "R",
    gradient: "from-app-purple/20 to-app-teal/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_R.png",
    description: "Poišči pot skozi labirint s črko R",
    path: "/govorne-igre/labirint/r",
    available: false
  },
  {
    id: "s",
    letter: "S",
    gradient: "from-dragon-green/20 to-app-teal/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_S.png",
    description: "Poišči pot skozi labirint s črko S",
    path: "/govorne-igre/labirint/s",
    available: false
  },
  {
    id: "š",
    letter: "Š",
    gradient: "from-app-blue/20 to-app-purple/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_SH.png",
    description: "Poišči pot skozi labirint s črko Š",
    path: "/govorne-igre/labirint/š",
    available: false
  },
  {
    id: "z",
    letter: "Z",
    gradient: "from-app-teal/20 to-dragon-green/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_Z.png",
    description: "Poišči pot skozi labirint s črko Z",
    path: "/govorne-igre/labirint/z",
    available: false
  },
  {
    id: "ž",
    letter: "Ž",
    gradient: "from-app-purple/20 to-app-blue/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_ZH.png",
    description: "Poišči pot skozi labirint s črko Ž",
    path: "/govorne-igre/labirint/ž",
    available: false
  }
];

export default function Labirint() {
  const navigate = useNavigate();
  const { user, selectedChild, signOut } = useAuth();
  const childName = selectedChild?.name;
  const isMobile = useIsMobile();
  const { dailyActivities, isLoading } = useDailyProgress();
  const [emblaRef] = useEmblaCarousel({ 
    align: 'start',
    dragFree: true,
    containScroll: 'trimSnaps'
  });
  
  const targetActivities = 15;
  const percentage = Math.min((dailyActivities / targetActivities) * 100, 100);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
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
      
      {/* Hero sekcija */}
      <section className="bg-dragon-green py-12 md:py-16 pt-24 md:pt-28">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Labirint{selectedChild ? `, ${selectedChild.name}` : ''}!
            </h1>
            <p className="text-xl text-white/90">
              Izberi črko in poišči pot skozi labirint
            </p>
          </div>
          
          {selectedChild && (
            <div className="max-w-md mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">Tvoj dnevni napredek</span>
                  <span className="text-white font-bold text-sm">{dailyActivities}/{targetActivities} ⭐</span>
                </div>
                <Progress 
                  value={percentage} 
                  className="h-3 bg-white/20 [&>div]:bg-app-orange"
                />
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Bela sekcija */}
      <section 
        className="py-12 bg-white min-h-screen" 
        style={{ backgroundColor: 'white' }}
      >
        <div className="container max-w-6xl mx-auto px-4">
          {/* Breadcrumb - samo na desktopu */}
          <div className="hidden lg:block mb-8">
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
