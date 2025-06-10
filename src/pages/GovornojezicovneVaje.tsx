
import Header from "@/components/Header";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Dumbbell, TestTube, Volume2, Clock, BookText, FileText, MessageSquare, Pen, Eye } from "lucide-react";

const GovornojezicovneVaje = () => {
  const navigate = useNavigate();

  const exerciseTypes = [
    {
      id: "vaje-za-jezik",
      title: "Vaje za jezik",
      description: "Gibalne vaje za jezik, ki pomagajo pri obdelavni artikulaciji in razvijajo govorne organe.",
      icon: Dumbbell,
      color: "text-app-purple",
      gradient: "from-app-purple/10 to-app-blue/10",
      path: "/govorno-jezikovne-vaje/vaje-za-jezik",
      example: "Primer: gibanje jezika gor, dol, lažkamo in razpiranje."
    },
    {
      id: "artikulacijski-test",
      title: "Artikulacijski test",
      description: "Test za preverjanje izgovorjave glasov R, S, Š in K.",
      icon: TestTube,
      color: "text-app-blue",
      gradient: "from-app-blue/10 to-app-purple/10",
      path: "/artikulacijski-test",
      example: "Primer: preverjanje pravilne izgovorjave posameznih glasov."
    },
    {
      id: "motnja-izreke", 
      title: "Motnja izreke / artikulacije",
      description: "Otroci se spopadajo z napačno izreko posebnih glasov, ki jih v vsakih osvojil samoli ali ob podporo.",
      icon: Volume2,
      color: "text-app-orange",
      gradient: "from-app-orange/10 to-app-yellow/10",
      path: "/artikulacija",
      example: "Primer: \"hibe\" namesto \"ribi\", \"Šupe\" namesto \"žabe\"."
    },
    {
      id: "motnja-ritma-tempa",
      title: "Motnja ritma in tempa govora",
      description: "Govorna hitkoživost ali prelepima \"Žadlč\" na ni matrial, \"neustralnih\" čaširi govornih rezi besedami.",
      icon: Clock,
      color: "text-dragon-green",
      gradient: "from-dragon-green/10 to-app-teal/10",
      path: "/govorno-jezikovne-vaje/motnja-ritma-tempa",
      example: ""
    },
    {
      id: "sibek-besedni-zaklad",
      title: "Šibek besedni zaklad",
      description: "Otrok pozna premalo besed za svojo starost. Pogosto uporablja imate besede ali ne več poimenovane predmeinte, čustev, dejanj ipd.",
      icon: BookText,
      color: "text-app-blue",
      gradient: "from-app-blue/10 to-app-purple/10",
      path: "/govorno-jezikovne-vaje/sibek-besedni-zaklad",
      example: ""
    },
    {
      id: "neustrezna-dolzina-struktura",
      title: "Neustrezna dolžina in struktura stavka",
      description: "Otrok tvori prekratke stavke ali neustrezno postavlja besede.",
      icon: FileText,
      color: "text-app-purple",
      gradient: "from-app-purple/10 to-app-blue/10",
      path: "/govorno-jezikovne-vaje/neustrezna-dolzina-struktura",
      example: "Primer: \"za pač imarada\" namesto \"Jaz grem v park\"."
    },
    {
      id: "slovnicno-neustrezni-stavki",
      title: "Slovnično neustrezni ali skopi stavki",
      description: "Otrok ne uporablja stavčnih začetkov, napačno spregathe.",
      icon: MessageSquare,
      color: "text-dragon-green",
      gradient: "from-dragon-green/10 to-app-teal/10",
      path: "/govorno-jezikovne-vaje/slovnicno-neustrezni-stavki",
      example: "Primer: \"Jaz ni grem\""
    },
    {
      id: "napacna-raba-koncnic",
      title: "Napačna raba besednih končnic",
      description: "Otrok nepravilno skli, imento ali skipa.",
      icon: Pen,
      color: "text-app-orange",
      gradient: "from-app-orange/10 to-app-yellow/10",
      path: "/govorno-jezikovne-vaje/napacna-raba-koncnic",
      example: "Primer: \"Mama reka\" namesto \"Mama je rekla\"."
    },
    {
      id: "napacna-raba-besed",
      title: "Napačna raba besed pri sporočanju",
      description: "Otrok uporablja napačne ali njasne besede.",
      icon: MessageSquare,
      color: "text-app-blue",
      gradient: "from-app-blue/10 to-app-purple/10",
      path: "/govorno-jezikovne-vaje/napacna-raba-besed",
      example: "Primer: \"Tisto tam je potrebe dol\" namesto \"Kozarec je pod j mizo\"."
    },
    {
      id: "slaba-sposobnost-zavedanja",
      title: "Slaba sposobnost zavedanja in ločevanja glasov",
      description: "Otrok težje slišl razlike med podobnimi glasovi. Pogosto vidi v besede ena konni, glasovi za odistavci.",
      icon: Eye,
      color: "text-dragon-green",
      gradient: "from-dragon-green/10 to-app-teal/10",
      path: "/govorno-jezikovne-vaje/slaba-sposobnost-zavedanja",
      example: ""
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageHeader title="Govorno-jezikovne vaje" backPath="/moja-stran" />
      
      <div className="container max-w-5xl mx-auto pt-8 pb-20 px-4">
        <p className="text-muted-foreground mb-8">
          Izberi eno izmed govornih vaj in začni z vadbo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exerciseTypes.map((exercise) => (
            <Card 
              key={exercise.id}
              className="transition-all duration-300 hover:shadow-lg rounded-2xl border-2 border-gray-200 cursor-pointer h-full flex flex-col"
              onClick={() => navigate(exercise.path)}
            >
              <CardHeader className={`bg-gradient-to-r ${exercise.gradient} rounded-t-2xl pb-4`}>
                <CardTitle className="text-xl flex items-center justify-center gap-2 text-center">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-200">
                    <exercise.icon className={`h-6 w-6 ${exercise.color}`} />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 pb-4 flex-grow">
                <h3 className={`text-lg font-semibold mb-2 ${exercise.color} text-center`}>{exercise.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{exercise.description}</p>
                {exercise.example && (
                  <p className="text-xs text-gray-500 italic">{exercise.example}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GovornojezicovneVaje;
