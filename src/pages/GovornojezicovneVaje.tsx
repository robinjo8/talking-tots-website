import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import AnimatedBackground from "@/components/AnimatedBackground";
const GovornojezicovneVaje = () => {
  const navigate = useNavigate();
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
  return <div className="min-h-screen relative">
      <AnimatedBackground />
      <Header />
      
      <div className="container max-w-5xl mx-auto pt-28 md:pt-32 pb-20 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {exerciseTypes.map(exercise => <Card key={exercise.id} className={cn("transition-all duration-300 rounded-2xl border-2 border-gray-200 h-full flex flex-col", exercise.available ? "hover:shadow-lg cursor-pointer" : "opacity-50 cursor-not-allowed")} onClick={() => exercise.available && navigate(exercise.path)}>
              <CardHeader className={`bg-gradient-to-r ${exercise.gradient} rounded-t-2xl pb-4 flex items-center justify-center`}>
                <CardTitle className={`text-lg font-semibold text-center ${exercise.color}`}>
                  {exercise.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 pb-4 flex-grow text-center">
                <p className="text-sm text-gray-600 mb-3 text-justify">{exercise.description}</p>
                {exercise.example && <p className="text-sm text-gray-500 mb-3 italic">{exercise.example}</p>}
                {!exercise.available && <div className="mt-3 text-sm text-muted-foreground italic">
                    Kmalu na voljo
                  </div>}
              </CardContent>
            </Card>)}
        </div>
      </div>
    </div>;
};
export default GovornojezicovneVaje;