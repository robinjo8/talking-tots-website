import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useDailyProgress } from "@/hooks/useDailyProgress";
import { FooterSection } from "@/components/FooterSection";
const GovornojezicovneVaje = () => {
  const { user, selectedChild, signOut } = useAuth();
  const navigate = useNavigate();
  const { dailyActivities, isLoading } = useDailyProgress();
  
  const targetActivities = 15;
  const percentage = Math.min((dailyActivities / targetActivities) * 100, 100);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error in GovornojezicovneVaje handleSignOut:", error);
      toast.error("Napaka pri odjavi");
    }
  };

  if (!user) {
    navigate("/login");
    return null;
  }
  const exerciseTypes = [{
    id: "vaje-motorike-govoril",
    title: "VAJE MOTORIKE GOVORIL",
    description: "Vaje motorike govoril so namenjene razgibavanju govoril – ust, ustnic, jezika. Hkrati gibljemo tudi nekatere druge dele obraza in ust, ki so vključeni v govor in tudi negovorne aktivnosti. Vaje so pomembne za izboljšanje motorike ust, ki z ostalimi deli govornega aparata oblikuje posamezne glasove ter seveda sam govor. Vaje motorike govoril niso pogoj za pojav govora in ne uporabljamo jih pri terapiji vseh govorno-jezikovnih motenj.",
    color: "text-app-purple",
    gradient: "from-app-purple/10 to-app-blue/10",
    path: "/govorno-jezikovne-vaje/vaje-motorike-govoril",
    example: "Primer: gibanje jezika gor, dol, lažkamo in razpiranje.",
    available: true
  }, {
    id: "motnja-izreke",
    title: "VAJE ZA IZGOVORJAVO GLASOV",
    description: "Otroci se spopadajo z napačno izreko posebnih glasov, ki jih v vsakjih osvojil samoli ali ob podporo.",
    color: "text-app-orange",
    gradient: "from-app-orange/10 to-app-yellow/10",
    path: "/govorno-jezikovne-vaje/artikulacija",
    example: "Primer: \"hibe\" namesto \"ribi\", \"Šupe\" namesto \"žabe\".",
    available: true
  }, {
    id: "motnja-ritma-tempa",
    title: "MOTNJA RITMA IN TEMPA GOVORA",
    description: "Govorna hitkoživost ali prelepima \"Žadlč\" na ni matrial, \"neustralnih\" čaširi govornih rezi besedami.",
    color: "text-dragon-green",
    gradient: "from-dragon-green/10 to-app-teal/10",
    path: "/govorno-jezikovne-vaje/motnja-ritma-tempa",
    example: "",
    available: false
  }, {
    id: "sibek-besedni-zaklad",
    title: "ŠIBEK BESEDNI ZAKLAD",
    description: "Otrok pozna premalo besed za svojo starost. Pogosto uporablja imate besede ali ne več poimenovane predmeinte, čustev, dejanj ipd.",
    color: "text-app-blue",
    gradient: "from-app-blue/10 to-app-purple/10",
    path: "/govorno-jezikovne-vaje/sibek-besedni-zaklad",
    example: "",
    available: false
  }, {
    id: "neustrezna-dolzina-struktura",
    title: "NEUSTREZNA DOLŽINA IN STRUKTURA STAVKA",
    description: "Otrok tvori prekratke stavke ali neustrezno postavlja besede.",
    color: "text-app-purple",
    gradient: "from-app-purple/10 to-app-blue/10",
    path: "/govorno-jezikovne-vaje/neustrezna-dolzina-struktura",
    example: "Primer: \"za pač imarada\" namesto \"Jaz grem v park\".",
    available: false
  }, {
    id: "slovnicno-neustrezni-stavki",
    title: "SLOVNIČNO NEUSTREZNI ALI SKOPI STAVKI",
    description: "Otrok ne uporablja stavčnih začetkov, napačno spregathe.",
    color: "text-dragon-green",
    gradient: "from-dragon-green/10 to-app-teal/10",
    path: "/govorno-jezikovne-vaje/slovnicno-neustrezni-stavki",
    example: "Primer: \"Jaz ni grem\"",
    available: false
  }, {
    id: "napacna-raba-koncnic",
    title: "NAPAČNA RABA BESEDNIH KONČNIC",
    description: "Otrok nepravilno skli, imiento ali skipa.",
    color: "text-app-orange",
    gradient: "from-app-orange/10 to-app-yellow/10",
    path: "/govorno-jezikovne-vaje/napacna-raba-koncnic",
    example: "Primer: \"Mama reka\" namesto \"Mama je rekla\".",
    available: false
  }, {
    id: "napacna-raba-besed",
    title: "NAPAČNA RABA BESED PRI SPOROČANJU",
    description: "Otrok uporablja napačne ali njasne besede.",
    color: "text-app-blue",
    gradient: "from-app-blue/10 to-app-purple/10",
    path: "/govorno-jezikovne-vaje/napacna-raba-besed",
    example: "Primer: \"Tisto tam je potrebe dol\" namesto \"Kozarec je pod j mizo\".",
    available: false
  }, {
    id: "slaba-sposobnost-zavedanja",
    title: "SLABA SPOSOBNOST ZAVEDANJA IN LOČEVANJA GLASOV",
    description: "Otrok težje slišl razlike med podobnimi glasovi. Pogosto vidi v besede ena konni, glasovi za odistavci.",
    color: "text-dragon-green",
    gradient: "from-dragon-green/10 to-app-teal/10",
    path: "/govorno-jezikovne-vaje/slaba-sposobnost-zavedanja",
    example: "",
    available: false
  }];
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero sekcija */}
      <section className="bg-dragon-green py-12 md:py-16 pt-24 md:pt-28">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Govorno-jezikovne vaje{selectedChild ? `, ${selectedChild.name}` : ''}!
            </h1>
            <p className="text-xl text-white/90">
              Izberi vajo in se zabavaj pri učenju!
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
      
      {/* Bela sekcija z vajami */}
      <section 
        className="py-12 bg-white min-h-screen" 
        style={{ backgroundColor: 'white' }}
      >
        <div className="container max-w-6xl mx-auto px-4">
          {/* Breadcrumb - samo na desktopu */}
          <div className="hidden lg:block mb-8">
            <BreadcrumbNavigation />
          </div>
          
          {selectedChild ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {exerciseTypes.map(exercise => (
                <div key={exercise.id} className="flex h-full">
                  <Card 
                    className={cn(
                      "transition-all duration-300 rounded-2xl border-2 border-gray-200 flex flex-col w-full", 
                      exercise.available ? "hover:shadow-lg cursor-pointer" : "opacity-50 cursor-not-allowed"
                    )} 
                    onClick={() => exercise.available && navigate(exercise.path)}
                  >
                    <CardHeader className={`bg-gradient-to-r ${exercise.gradient} rounded-t-2xl pb-4 flex items-center justify-center`}>
                      <CardTitle className={`text-lg font-semibold text-center ${exercise.color} min-h-[3.5rem] flex items-center`}>
                        {exercise.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 pb-4 flex flex-col flex-grow text-center">
                      <p className="text-sm text-gray-600 mb-3 text-justify">{exercise.description}</p>
                      {exercise.example && <p className="text-sm text-gray-500 mb-3 italic">{exercise.example}</p>}
                      {!exercise.available && (
                        <div className="mt-3 text-sm text-muted-foreground italic">
                          Kmalu na voljo
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <div className="min-h-[400px] flex flex-col items-center justify-center">
              <p className="text-lg text-red-500">
                Prosimo, dodajte profil otroka v nastavitvah.
              </p>
            </div>
          )}
        </div>
      </section>
      
      <FooterSection handleSignOut={handleSignOut} />
    </div>
  );
};
export default GovornojezicovneVaje;