import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useDailyProgress } from "@/hooks/useDailyProgress";
import Header from "@/components/Header";
import { FooterSection } from "@/components/FooterSection";
import { Progress } from "@/components/ui/progress";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { metKockeLetters } from "@/data/metKockeConfig";

const SUPABASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public";

// Map letters to dragon image names (ASCII safe)
const letterToImage: Record<string, string> = {
  'c': 'zmajcek_crka_C.png',
  'ch': 'zmajcek_crka_CH.png',
  'k': 'zmajcek_crka_K.png',
  'l': 'zmajcek_crka_L.png',
  'r': 'zmajcek_crka_R.png',
  's': 'zmajcek_crka_S.png',
  'sh': 'zmajcek_crka_SH.png',
  'z': 'zmajcek_crka_Z.png',
  'zh': 'zmajcek_crka_ZH.png',
};

export default function MetKockeGames() {
  const navigate = useNavigate();
  const { user, selectedChild, signOut, isLoading } = useAuth();
  const { dailyActivities } = useDailyProgress();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      toast.error("Napaka pri odjavi");
    }
  };

  const handleLetterClick = (path: string) => {
    navigate(path);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app-blue" />
      </div>
    );
  }

  const percentage = Math.min((dailyActivities / 15) * 100, 100);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#e8f4fc] via-[#d1e9f9] to-[#b8dff5]">
      <Header />
      
      {/* Mobile back button */}
      {isMobile && (
        <div className="fixed top-20 left-4 z-40">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/govorne-igre')}
            className="rounded-full bg-background/80 backdrop-blur shadow-md"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
      )}
      
      {/* Hero Section */}
      <div className="pt-24 md:pt-28 pb-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Met kocke 🎲
          </h1>
          {selectedChild && (
            <div className="space-y-2">
              <p className="text-lg text-muted-foreground">
                Izberi črko in vrzi kocko, {selectedChild.name}!
              </p>
              <div className="max-w-xs mx-auto">
                <Progress value={percentage} className="h-3" />
                <p className="text-sm text-muted-foreground mt-1">
                  Dnevni napredek: {dailyActivities}/15 aktivnosti
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-grow px-4 pb-8">
        <div className="max-w-5xl mx-auto">
          {!isMobile && <BreadcrumbNavigation />}
          
          {selectedChild ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
              {metKockeLetters.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleLetterClick(item.path)}
                  className={`
                    group relative overflow-hidden rounded-2xl shadow-lg 
                    transition-all duration-300 hover:scale-105 hover:shadow-xl
                    bg-gradient-to-br ${item.gradient} p-4
                  `}
                >
                  <div className="aspect-square flex flex-col items-center justify-center">
                    <img
                      src={`${SUPABASE_URL}/zmajcki/${letterToImage[item.id]}`}
                      alt={`Zmajček ${item.letter}`}
                      className="w-3/4 h-3/4 object-contain mb-2"
                    />
                    <h3 className="text-xl md:text-2xl font-bold text-foreground">
                      {item.title}
                    </h3>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                Za igranje dodaj profil otroka v nastavitvah.
              </p>
              <Button 
                onClick={() => navigate('/profile')} 
                className="mt-4 bg-app-orange hover:bg-app-orange/90"
              >
                Dodaj profil otroka
              </Button>
            </div>
          )}
        </div>
      </main>

      <FooterSection handleSignOut={handleSignOut} />
    </div>
  );
}
