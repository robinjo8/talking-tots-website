import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Dumbbell, TestTube, Volume2, Clock, BookText, FileText, MessageSquare, Pen, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
const GovornojezicovneVaje = () => {
  const navigate = useNavigate();
  const exerciseTypes = [{
    id: "vaje-motorike-govoril",
    title: "Vaje motorike govoril",
    description: "Vaje motorike govoril so namenjene razgibavanju govoril – ust, ustnic, jezika. Hkrati gibljemo tudi nekatere druge dele obraza in ust, ki so vključeni v govor in tudi negovorne aktivnosti. Vaje so pomembne za izboljšanje motorike ust, ki z ostalimi deli govornega aparata oblikuje posamezne glasove ter seveda sam govor. Vaje motorike govoril niso pogoj za pojav govora in ne uporabljamo jih pri terapiji vseh govorno-jezikovnih motenj.",
    icon: Dumbbell,
    color: "text-app-purple",
    gradient: "from-app-purple/10 to-app-blue/10",
    path: "/govorno-jezikovne-vaje/vaje-motorike-govoril",
    example: "Primer: gibanje jezika gor, dol, lažkamo in razpiranje.",
    available: true
  }, {
    id: "motnja-izreke",
    title: "Motnja izreke / artikulacije",
    description: "Otroci se spopadajo z napačno izreko posebnih glasov, ki jih v vsakih osvojil samoli ali ob podporo.",
    icon: Volume2,
    color: "text-app-orange",
    gradient: "from-app-orange/10 to-app-yellow/10",
    path: "/artikulacija",
    example: "Primer: \"hibe\" namesto \"ribi\", \"Šupe\" namesto \"žabe\".",
    available: true
  }, {
    id: "motnja-ritma-tempa",
    title: "Motnja ritma in tempa govora",
    description: "Govorna hitkoživost ali prelepima \"Žadlč\" na ni matrial, \"neustralnih\" čaširi govornih rezi besedami.",
    icon: Clock,
    color: "text-dragon-green",
    gradient: "from-dragon-green/10 to-app-teal/10",
    path: "/govorno-jezikovne-vaje/motnja-ritma-tempa",
    example: "",
    available: false
  }, {
    id: "sibek-besedni-zaklad",
    title: "Šibek besedni zaklad",
    description: "Otrok pozna premalo besed za svojo starost. Pogosto uporablja imate besede ali ne več poimenovane predmeinte, čustev, dejanj ipd.",
    icon: BookText,
    color: "text-app-blue",
    gradient: "from-app-blue/10 to-app-purple/10",
    path: "/govorno-jezikovne-vaje/sibek-besedni-zaklad",
    example: "",
    available: false
  }, {
    id: "neustrezna-dolzina-struktura",
    title: "Neustrezna dolžina in struktura stavka",
    description: "Otrok tvori prekratke stavke ali neustrezno postavlja besede.",
    icon: FileText,
    color: "text-app-purple",
    gradient: "from-app-purple/10 to-app-blue/10",
    path: "/govorno-jezikovne-vaje/neustrezna-dolzina-struktura",
    example: "Primer: \"za pač imarada\" namesto \"Jaz grem v park\".",
    available: false
  }, {
    id: "slovnicno-neustrezni-stavki",
    title: "Slovnično neustrezni ali skopi stavki",
    description: "Otrok ne uporablja stavčnih začetkov, napačno spregathe.",
    icon: MessageSquare,
    color: "text-dragon-green",
    gradient: "from-dragon-green/10 to-app-teal/10",
    path: "/govorno-jezikovne-vaje/slovnicno-neustrezni-stavki",
    example: "Primer: \"Jaz ni grem\"",
    available: false
  }, {
    id: "napacna-raba-koncnic",
    title: "Napačna raba besednih končnic",
    description: "Otrok nepravilno skli, imiento ali skipa.",
    icon: Pen,
    color: "text-app-orange",
    gradient: "from-app-orange/10 to-app-yellow/10",
    path: "/govorno-jezikovne-vaje/napacna-raba-koncnic",
    example: "Primer: \"Mama reka\" namesto \"Mama je rekla\".",
    available: false
  }, {
    id: "napacna-raba-besed",
    title: "Napačna raba besed pri sporočanju",
    description: "Otrok uporablja napačne ali njasne besede.",
    icon: MessageSquare,
    color: "text-app-blue",
    gradient: "from-app-blue/10 to-app-purple/10",
    path: "/govorno-jezikovne-vaje/napacna-raba-besed",
    example: "Primer: \"Tisto tam je potrebe dol\" namesto \"Kozarec je pod j mizo\".",
    available: false
  }, {
    id: "slaba-sposobnost-zavedanja",
    title: "Slaba sposobnost zavedanja in ločevanja glasov",
    description: "Otrok težje slišl razlike med podobnimi glasovi. Pogosto vidi v besede ena konni, glasovi za odistavci.",
    icon: Eye,
    color: "text-dragon-green",
    gradient: "from-dragon-green/10 to-app-teal/10",
    path: "/govorno-jezikovne-vaje/slaba-sposobnost-zavedanja",
    example: "",
    available: false
  }];
  return <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-5xl mx-auto pt-28 md:pt-32 pb-20 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {exerciseTypes.map(exercise => <Card key={exercise.id} className={cn("transition-all duration-300 rounded-2xl border-2 border-gray-200 h-full flex flex-col", exercise.available ? "hover:shadow-lg cursor-pointer" : "opacity-50 cursor-not-allowed")} onClick={() => exercise.available && navigate(exercise.path)}>
              <CardHeader className={`bg-gradient-to-r ${exercise.gradient} rounded-t-2xl pb-4`}>
                <CardTitle className="text-xl flex items-center justify-center gap-2 text-center">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-200">
                    <exercise.icon className={`h-6 w-6 ${exercise.color}`} />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 pb-4 flex-grow text-center">
                <h3 className={`text-lg font-semibold mb-2 ${exercise.color}`}>{exercise.title}</h3>
                <p className="text-sm text-gray-600 mb-3 text-justify">{exercise.description}</p>
                {exercise.example}
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