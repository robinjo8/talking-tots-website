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
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const artikulacijaLetters = [
  // C
  {
    id: "vaje-c-zacetek",
    letter: "C",
    title: "Črka C - začetek",
    gradient: "from-dragon-green/20 to-dragon-green/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_C.png",
    description: "Vadi izgovorjavo črke C na začetku besede",
    path: "/govorno-jezikovne-vaje/artikulacija/c",
    available: true
  },
  {
    id: "vaje-c-sredina-konec",
    letter: "C",
    title: "Črka C - sredina/konec",
    gradient: "from-dragon-green/20 to-dragon-green/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_C.png",
    description: "Vadi izgovorjavo črke C na sredini in koncu besede",
    path: "/govorno-jezikovne-vaje/artikulacija/c-sredina-konec",
    available: true
  },
  // Č
  {
    id: "vaje-č-zacetek",
    letter: "Č",
    title: "Črka Č - začetek",
    gradient: "from-app-blue/20 to-app-teal/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_CH.png",
    description: "Vadi izgovorjavo črke Č na začetku besede",
    path: "/govorno-jezikovne-vaje/artikulacija/č",
    available: true
  },
  {
    id: "vaje-č-sredina-konec",
    letter: "Č",
    title: "Črka Č - sredina/konec",
    gradient: "from-app-blue/20 to-app-teal/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_CH.png",
    description: "Vadi izgovorjavo črke Č na sredini in koncu besede",
    path: "/govorno-jezikovne-vaje/artikulacija/č-sredina-konec",
    available: true
  },
  // K
  {
    id: "vaje-k-zacetek",
    letter: "K",
    title: "Črka K - začetek",
    gradient: "from-app-orange/20 to-app-yellow/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_K.png",
    description: "Vadi izgovorjavo črke K na začetku besede",
    path: "/govorno-jezikovne-vaje/artikulacija/k",
    available: true
  },
  {
    id: "vaje-k-sredina-konec",
    letter: "K",
    title: "Črka K - sredina/konec",
    gradient: "from-app-orange/20 to-app-yellow/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_K.png",
    description: "Vadi izgovorjavo črke K na sredini in koncu besede",
    path: "/govorno-jezikovne-vaje/artikulacija/k-sredina-konec",
    available: true
  },
  // L
  {
    id: "vaje-l-zacetek",
    letter: "L",
    title: "Črka L - začetek",
    gradient: "from-app-purple/20 to-app-blue/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_L.png",
    description: "Vadi izgovorjavo črke L na začetku besede",
    path: "/govorno-jezikovne-vaje/artikulacija/l",
    available: true
  },
  {
    id: "vaje-l-sredina-konec",
    letter: "L",
    title: "Črka L - sredina/konec",
    gradient: "from-app-purple/20 to-app-blue/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_L.png",
    description: "Vadi izgovorjavo črke L na sredini in koncu besede",
    path: "/govorno-jezikovne-vaje/artikulacija/l-sredina-konec",
    available: true
  },
  // R
  {
    id: "vaje-r-zacetek",
    letter: "R",
    title: "Črka R - začetek",
    gradient: "from-app-purple/20 to-app-teal/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_R.png",
    description: "Vadi izgovorjavo črke R na začetku besede",
    path: "/govorno-jezikovne-vaje/artikulacija/r",
    available: true
  },
  {
    id: "vaje-r-sredina-konec",
    letter: "R",
    title: "Črka R - sredina/konec",
    gradient: "from-app-purple/20 to-app-teal/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_R.png",
    description: "Vadi izgovorjavo črke R na sredini in koncu besede",
    path: "/govorno-jezikovne-vaje/artikulacija/r-sredina-konec",
    available: true
  },
  // S
  {
    id: "vaje-s-zacetek",
    letter: "S",
    title: "Črka S - začetek",
    gradient: "from-dragon-green/20 to-app-teal/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_S.png",
    description: "Vadi izgovorjavo črke S na začetku besede",
    path: "/govorno-jezikovne-vaje/artikulacija/s",
    available: true
  },
  {
    id: "vaje-s-sredina-konec",
    letter: "S",
    title: "Črka S - sredina/konec",
    gradient: "from-dragon-green/20 to-app-teal/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_S.png",
    description: "Vadi izgovorjavo črke S na sredini in koncu besede",
    path: "/govorno-jezikovne-vaje/artikulacija/s-sredina-konec",
    available: true
  },
  // Š
  {
    id: "vaje-š-zacetek",
    letter: "Š",
    title: "Črka Š - začetek",
    gradient: "from-app-blue/20 to-app-purple/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_SH.png",
    description: "Vadi izgovorjavo črke Š na začetku besede",
    path: "/govorno-jezikovne-vaje/artikulacija/š",
    available: true
  },
  {
    id: "vaje-š-sredina-konec",
    letter: "Š",
    title: "Črka Š - sredina/konec",
    gradient: "from-app-blue/20 to-app-purple/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_SH.png",
    description: "Vadi izgovorjavo črke Š na sredini in koncu besede",
    path: "/govorno-jezikovne-vaje/artikulacija/š-sredina-konec",
    available: true
  },
  // Z
  {
    id: "vaje-z-zacetek",
    letter: "Z",
    title: "Črka Z - začetek",
    gradient: "from-app-teal/20 to-dragon-green/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_Z.png",
    description: "Vadi izgovorjavo črke Z na začetku besede",
    path: "/govorno-jezikovne-vaje/artikulacija/z",
    available: true
  },
  {
    id: "vaje-z-sredina-konec",
    letter: "Z",
    title: "Črka Z - sredina/konec",
    gradient: "from-app-teal/20 to-dragon-green/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_Z.png",
    description: "Vadi izgovorjavo črke Z na sredini in koncu besede",
    path: "/govorno-jezikovne-vaje/artikulacija/z-sredina-konec",
    available: true
  },
  // Ž
  {
    id: "vaje-ž-zacetek",
    letter: "Ž",
    title: "Črka Ž - začetek",
    gradient: "from-app-purple/20 to-app-blue/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_ZH.png",
    description: "Vadi izgovorjavo črke Ž na začetku besede",
    path: "/govorno-jezikovne-vaje/artikulacija/ž",
    available: true
  },
  {
    id: "vaje-ž-sredina-konec",
    letter: "Ž",
    title: "Črka Ž - sredina/konec",
    gradient: "from-app-purple/20 to-app-blue/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_ZH.png",
    description: "Vadi izgovorjavo črke Ž na sredini in koncu besede",
    path: "/govorno-jezikovne-vaje/artikulacija/ž-sredina-konec",
    available: true
  }
];

export default function ArtikulacijaVaje() {
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
      console.error("Error in ArtikulacijaVaje handleSignOut:", error);
      toast.error("Napaka pri odjavi");
    }
  };

  const handleLetterClick = (letter: typeof artikulacijaLetters[0]) => {
    navigate(letter.path);
  };

  const LetterCard = ({ letter }: { letter: typeof artikulacijaLetters[0] }) => (
    <div
      className="bg-card rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group border border-gray-200"
      onClick={() => handleLetterClick(letter)}
    >
      {/* Card Image */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${letter.gradient} ${isMobile ? 'aspect-square' : 'aspect-video'}`}>
        <div className="w-full h-full flex items-center justify-center">
          <img 
            src={letter.image}
            alt={`Črka ${letter.letter}`}
            className={`object-contain group-hover:scale-110 transition-transform duration-300 ${isMobile ? 'w-[80%] h-[80%]' : 'w-full h-full'}`}
            style={{ mixBlendMode: 'multiply' }}
          />
        </div>
      </div>

      {/* Card Content */}
      <div className={`p-6 ${isMobile ? 'text-center' : ''}`}>
        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-app-blue transition-colors">
          {letter.title}
        </h3>
        {!isMobile && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {letter.description}
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
          onClick={() => navigate("/govorno-jezikovne-vaje")}
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
              Artikulacija
            </h1>
            <p className="text-xl text-white/90">
              Izberi črko za vajo izgovorjave
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
          {/* Breadcrumb */}
          <div className="mb-8">
            <BreadcrumbNavigation />
          </div>
          
          {/* Letters grid */}
          <div className="mb-12">
            {isMobile ? (
              /* Mobile: 2-column grid */
              <div className="grid grid-cols-2 gap-4">
                {artikulacijaLetters.map(letter => (
                  <LetterCard key={letter.id} letter={letter} />
                ))}
              </div>
            ) : (
              /* Desktop: Grid layout */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {artikulacijaLetters.map(letter => (
                  <LetterCard key={letter.id} letter={letter} />
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