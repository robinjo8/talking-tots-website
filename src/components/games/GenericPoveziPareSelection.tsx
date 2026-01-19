import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getAgeGroup } from "@/utils/ageUtils";
import useEmblaCarousel from "embla-carousel-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { Progress } from "@/components/ui/progress";
import { useDailyProgress } from "@/hooks/useDailyProgress";
import { FooterSection } from "@/components/FooterSection";
import { toast } from "sonner";
import { getLettersForAgeGroup, toAsciiUrl, getAgeGroupDisplayName, PoveziPareConfig } from "@/data/poveziPareConfig";

interface Props {
  ageGroup: string; // "34", "56", "78", "910"
}

export function GenericPoveziPareSelection({ ageGroup }: Props) {
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

  // Get letters for this age group
  const letterData = getLettersForAgeGroup(ageGroup);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error in GenericPoveziPareSelection handleSignOut:", error);
      toast.error("Napaka pri odjavi");
    }
  };

  // Check if child is in correct age group
  const childAge = selectedChild?.age || 3;
  const currentAgeGroup = getAgeGroup(childAge);
  const requiredAgeGroup = letterData[0]?.requiredAgeGroup || '3-4';

  if (currentAgeGroup !== requiredAgeGroup) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-5xl mx-auto pt-28 md:pt-32 pb-20 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Dostop omejen</h1>
            <p className="text-muted-foreground">
              Ta igra je namenjena otrokom starosti {getAgeGroupDisplayName(ageGroup)}.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const LetterCard = ({ config }: { config: PoveziPareConfig }) => (
    <div
      className="bg-card rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group border border-gray-200"
      onClick={() => navigate(`/govorne-igre/povezi-pare/${ageGroup}/${config.urlKey}`)}
    >
      {/* Card Image */}
      <div className={`relative aspect-video overflow-hidden bg-gradient-to-br ${config.gradient}`}>
        <div className="w-full h-full flex items-center justify-center">
          <img 
            src={config.image}
            alt={`Črka ${config.letter}`}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
            style={{ mixBlendMode: 'multiply' }}
          />
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-app-blue transition-colors">
          Črka {config.letter}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {config.description}
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
              Povezi pare{selectedChild ? `, ${selectedChild.name}` : ''}!
            </h1>
            <p className="text-xl text-white/90">
              Izberi črko in poveži pare slik
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
          
          {/* Instruction card */}
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
                <p className="text-lg font-medium italic">IZBERI ČRKO IN POMAGAJ TOMIJU POVEZATI PARE. NA KONCU PA SKUPAJ GLASNO PONOVITA BESEDO!</p>
                <p className="text-sm text-muted-foreground mt-2">Z VAJAMI POSTAJAMO VEDNO BOLJŠI!</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Letters grid */}
          <div className="mb-12">
            {isMobile ? (
              /* Mobile: 2-column grid for 3-4, carousel for others */
              ageGroup === '34' ? (
                <div className="grid grid-cols-2 gap-4">
                  {letterData.map(config => (
                    <LetterCard key={config.letter} config={config} />
                  ))}
                </div>
              ) : (
                <div className="overflow-hidden -mx-4" ref={emblaRef}>
                  <div className="flex gap-4 px-4">
                    {letterData.map(config => (
                      <div key={config.letter} className="flex-[0_0_85%] min-w-0">
                        <LetterCard config={config} />
                      </div>
                    ))}
                  </div>
                </div>
              )
            ) : (
              /* Desktop: Grid layout */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {letterData.map(config => (
                  <LetterCard key={config.letter} config={config} />
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
