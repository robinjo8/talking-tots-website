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
import { getAgeGroup } from "@/utils/ageUtils";

const sequenceGames = [
  {
    id: "zaporedja-s",
    letter: "S",
    gradient: "from-dragon-green/20 to-app-teal/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_S.png",
    description: "Uredi zaporedje besed z glasom S",
    available: true
  },
  {
    id: "zaporedja-z",
    letter: "Z",
    gradient: "from-app-teal/20 to-dragon-green/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_Z.png",
    description: "Uredi zaporedje besed z glasom Z",
    available: true
  },
  {
    id: "zaporedja-c",
    letter: "C",
    gradient: "from-dragon-green/20 to-dragon-green/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_C.png",
    description: "Uredi zaporedje besed z glasom C",
    available: true
  },
  {
    id: "zaporedja-š",
    letter: "Š",
    gradient: "from-app-blue/20 to-app-purple/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_SH.png",
    description: "Uredi zaporedje besed z glasom Š",
    available: true
  },
  {
    id: "zaporedja-ž",
    letter: "Ž",
    gradient: "from-app-purple/20 to-app-blue/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_ZH.png",
    description: "Uredi zaporedje besed z glasom Ž",
    available: true
  },
  {
    id: "zaporedja-č",
    letter: "Č",
    gradient: "from-app-blue/20 to-app-teal/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_CH.png",
    description: "Uredi zaporedje besed z glasom Č",
    available: true
  },
  {
    id: "zaporedja-k",
    letter: "K",
    gradient: "from-app-orange/20 to-app-yellow/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_K.png",
    description: "Uredi zaporedje besed z glasom K",
    available: true
  },
  {
    id: "zaporedja-l",
    letter: "L",
    gradient: "from-app-purple/20 to-app-blue/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_L.png",
    description: "Uredi zaporedje besed z glasom L",
    available: true
  },
  {
    id: "zaporedja-r",
    letter: "R",
    gradient: "from-app-purple/20 to-app-teal/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_R.png",
    description: "Uredi zaporedje besed z glasom R",
    available: true
  }
];

export default function Zaporedja() {
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
      console.error("Error in Zaporedja handleSignOut:", error);
      toast.error("Napaka pri odjavi");
    }
  };

  const handleCardClick = (game: typeof sequenceGames[0]) => {
    if (!game.available) return;
    
    // Get child's age group for routing
    const childAge = selectedChild?.age;
    const ageGroup = childAge ? getAgeGroup(childAge) : '3-4';
    
    // Map age groups to route suffixes
    const ageSuffixMap: Record<string, string> = {
      '3-4': '',
      '5-6': '56',
      '7-8': '78',
      '9-10': '910'
    };
    
    const suffix = ageSuffixMap[ageGroup] || '';
    
    const letterMap: Record<string, string> = {
      'C': '/govorne-igre/zaporedja/c',
      'Č': '/govorne-igre/zaporedja/ch',
      'K': '/govorne-igre/zaporedja/k',
      'L': '/govorne-igre/zaporedja/l',
      'R': '/govorne-igre/zaporedja/r',
      'S': '/govorne-igre/zaporedja/s',
      'Š': '/govorne-igre/zaporedja/sh',
      'Z': '/govorne-igre/zaporedja/z',
      'Ž': '/govorne-igre/zaporedja/zh'
    };
    
    const basePath = letterMap[game.letter];
    if (basePath) {
      navigate(basePath + suffix);
    }
  };

  const LetterCard = ({ game }: { game: typeof sequenceGames[0] }) => (
    <button
      type="button"
      className="bg-card rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group border border-gray-200 w-full text-left"
      onClick={() => handleCardClick(game)}
    >
      {/* Card Image */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${game.gradient} ${isMobile ? 'aspect-square' : 'aspect-video'}`}>
        <div className="w-full h-full flex items-center justify-center">
          <img 
            src={game.image}
            alt={`Glas ${game.letter}`}
            className={`object-contain group-hover:scale-110 transition-transform duration-300 ${isMobile ? 'w-[80%] h-[80%]' : 'w-full h-full'}`}
            style={{ mixBlendMode: 'multiply' }}
          />
        </div>
      </div>

      {/* Card Content */}
      <div className={`p-6 ${isMobile ? 'text-center' : ''}`}>
        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-app-blue transition-colors">
          Glas {game.letter}
        </h3>
        {!isMobile && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {game.description}
          </p>
        )}
      </div>
    </button>
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
              Zaporedja
            </h1>
            <p className="text-xl text-white/90">
              Izberi glas in uredi zaporedje besed
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
                {sequenceGames.map(game => (
                  <LetterCard key={game.id} game={game} />
                ))}
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
      </section>
      
      <FooterSection handleSignOut={handleSignOut} />
    </div>
  );
}
