import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { Progress } from "@/components/ui/progress";
import { useDailyProgress } from "@/hooks/useDailyProgress";
import { FooterSection } from "@/components/FooterSection";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock } from "lucide-react";
import { hasPonoviPovedConfig } from "@/data/ponoviPovedConfig";

// Letter selection cards - using ASCII-safe URL keys for Slovenian diacritics
const ponoviPovedLetters = [
  {
    id: "s",
    letter: "S",
    gradient: "from-dragon-green/20 to-app-teal/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_S.png",
    description: "Ponovi povedi s črko S",
    path: "/govorne-igre/ponovi-poved/s",
    urlKey: "s"
  },
  {
    id: "z",
    letter: "Z",
    gradient: "from-app-teal/20 to-dragon-green/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_Z.png",
    description: "Ponovi povedi s črko Z",
    path: "/govorne-igre/ponovi-poved/z",
    urlKey: "z"
  },
  {
    id: "c",
    letter: "C",
    gradient: "from-dragon-green/20 to-dragon-green/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_C.png",
    description: "Ponovi povedi s črko C",
    path: "/govorne-igre/ponovi-poved/c",
    urlKey: "c"
  },
  {
    id: "š",
    letter: "Š",
    gradient: "from-app-blue/20 to-app-purple/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_SH.png",
    description: "Ponovi povedi s črko Š",
    path: "/govorne-igre/ponovi-poved/sh",
    urlKey: "sh"
  },
  {
    id: "ž",
    letter: "Ž",
    gradient: "from-app-purple/20 to-app-blue/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_ZH.png",
    description: "Ponovi povedi s črko Ž",
    path: "/govorne-igre/ponovi-poved/zh",
    urlKey: "zh"
  },
  {
    id: "č",
    letter: "Č",
    gradient: "from-app-blue/20 to-app-teal/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_CH.png",
    description: "Ponovi povedi s črko Č",
    path: "/govorne-igre/ponovi-poved/ch",
    urlKey: "ch"
  },
  {
    id: "k",
    letter: "K",
    gradient: "from-app-orange/20 to-app-yellow/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_K.png",
    description: "Ponovi povedi s črko K",
    path: "/govorne-igre/ponovi-poved/k",
    urlKey: "k"
  },
  {
    id: "l",
    letter: "L",
    gradient: "from-app-purple/20 to-app-blue/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_L.png",
    description: "Ponovi povedi s črko L",
    path: "/govorne-igre/ponovi-poved/l",
    urlKey: "l"
  },
  {
    id: "r",
    letter: "R",
    gradient: "from-app-purple/20 to-app-teal/20",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_R.png",
    description: "Ponovi povedi s črko R",
    path: "/govorne-igre/ponovi-poved/r",
    urlKey: "r"
  }
];

export default function PonoviPoved() {
  const navigate = useNavigate();
  const { selectedChild, signOut } = useAuth();
  const isMobile = useIsMobile();
  const { dailyActivities } = useDailyProgress();
  
  const targetActivities = 15;
  const percentage = Math.min((dailyActivities / targetActivities) * 100, 100);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error in PonoviPoved handleSignOut:", error);
      toast.error("Napaka pri odjavi");
    }
  };

  const handleLetterClick = (letter: typeof ponoviPovedLetters[0]) => {
    // Check if configuration exists for this letter
    if (!hasPonoviPovedConfig(letter.urlKey)) {
      toast.info("Ta črka bo kmalu na voljo!");
      return;
    }
    navigate(letter.path);
  };

  const LetterCard = ({ letter }: { letter: typeof ponoviPovedLetters[0] }) => {
    const isAvailable = hasPonoviPovedConfig(letter.urlKey);
    
    return (
      <div
        className={`bg-card rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group border border-gray-200 ${
          !isAvailable ? 'opacity-60' : ''
        }`}
        onClick={() => handleLetterClick(letter)}
      >
        {/* Card Image */}
        <div className={`relative overflow-hidden bg-gradient-to-br ${letter.gradient} ${isMobile ? 'aspect-square' : 'aspect-video'}`}>
          {!isAvailable && (
            <div className="absolute top-2 right-2 bg-gray-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 z-10">
              <Lock className="w-3 h-3" />
              Kmalu
            </div>
          )}
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src={letter.image}
              alt={`Glas ${letter.letter}`}
              className={`object-contain group-hover:scale-110 transition-transform duration-300 ${isMobile ? 'w-[80%] h-[80%]' : 'w-full h-full'} ${!isAvailable ? 'grayscale-[30%]' : ''}`}
              style={{ mixBlendMode: 'multiply' }}
            />
          </div>
        </div>

        {/* Card Content */}
        <div className={`p-6 ${isMobile ? 'text-center' : ''}`}>
          <h3 className={`text-xl font-bold mb-3 group-hover:text-app-blue transition-colors ${!isAvailable ? 'text-gray-500' : 'text-foreground'}`}>
            Glas {letter.letter}
          </h3>
          {!isMobile && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {letter.description}
            </p>
          )}
        </div>
      </div>
    );
  };

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
              Ponovi poved
            </h1>
            <p className="text-xl text-white/90">
              Izberi črko in ponovi tri-besedne povedi
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
                {ponoviPovedLetters.map(letter => (
                  <LetterCard key={letter.id} letter={letter} />
                ))}
              </div>
            ) : (
              /* Desktop: Grid layout */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {ponoviPovedLetters.map(letter => (
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
