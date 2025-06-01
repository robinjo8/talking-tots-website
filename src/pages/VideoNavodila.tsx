
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Volume2, Zap, Wind, Clock, Dumbbell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function VideoNavodila() {
  const navigate = useNavigate();
  
  const videoSections = [
    {
      id: 'pronunciation',
      title: 'Pravilna izgovorjava posameznih glasov',
      description: 'Kako pravilno izgovoriti posamezne glasove (npr. R, L, S, Š, Č). Uporaba video modeliranja, kjer otroci posnemajo druge otroke pri izgovorjavi glasov.',
      icon: <Volume2 className="h-6 w-6 text-app-blue" />,
    },
    {
      id: 'motor-exercises',
      title: 'Vaje za motoriko govoril',
      description: 'Praktični prikazi vaj za jezik, ustnice in čeljust, ki izboljšujejo artikulacijo.',
      icon: <Dumbbell className="h-6 w-6 text-app-orange" />,
    },
    {
      id: 'breathing-exercises',
      title: 'Dihalne vaje za govor',
      description: 'Videi, ki učijo otroke pravilnega dihanja med govorom, kar pomaga pri tekočnosti govora. Uporaba zabavnih tehnik, kot so pihanje milnih mehurčkov ali pihanje peres, za spodbujanje pravilnega dihanja.',
      icon: <Wind className="h-6 w-6 text-app-teal" />,
    },
    {
      id: 'rhythm-exercises',
      title: 'Vaje za ritmizacijo in poudarjanje zlogov',
      description: 'Uporaba pesmic in rim za učenje ritma in poudarkov v besedah. Prikazi, kako otroci lahko s pomočjo ritma izboljšajo svojo izgovorjavo.',
      icon: <Clock className="h-6 w-6 text-app-purple" />,
    },
    {
      id: 'preparation',
      title: 'Priprava na govorno vajo',
      description: 'Videi, ki prikazujejo ogrevalne vaje pred začetkom govornih vaj, kot so masaža obraza ali raztezanje jezika. Poudarek na pomembnosti priprave za boljše rezultate pri govornih vajah.',
      icon: <Zap className="h-6 w-6 text-dragon-green" />,
    }
  ];

  const handleSectionSelect = (sectionId: string) => {
    // For now, show a "coming soon" message for all sections
    alert('Video navodila za to področje bodo na voljo kmalu!');
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-5xl mx-auto pt-32 pb-20 px-4">
        <div className="flex items-center gap-3 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-2" 
            onClick={() => navigate("/moja-stran")}
          >
            <ArrowLeft className="h-4 w-4" />
            Nazaj
          </Button>
          
          <h1 className="text-2xl font-bold text-foreground">
            Video navodila
          </h1>
        </div>
        
        <p className="text-muted-foreground mb-8">
          Poglej, kako logoped pravilno izgovori posamezne glasove in se nauči pravilnih tehnik.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {videoSections.map((section) => (
            <Card 
              key={section.id} 
              className="transition-all duration-300 hover:shadow-lg rounded-2xl border-2 border-gray-200 cursor-pointer h-full flex flex-col"
              onClick={() => handleSectionSelect(section.id)}
            >
              <CardHeader className={`
                rounded-t-2xl pb-4
                ${section.id === 'pronunciation' && 'bg-gradient-to-r from-app-blue/10 to-app-teal/10'}
                ${section.id === 'motor-exercises' && 'bg-gradient-to-r from-app-orange/10 to-app-yellow/10'}
                ${section.id === 'breathing-exercises' && 'bg-gradient-to-r from-app-teal/10 to-dragon-green/10'}
                ${section.id === 'rhythm-exercises' && 'bg-gradient-to-r from-app-purple/10 to-app-blue/10'}
                ${section.id === 'preparation' && 'bg-gradient-to-r from-dragon-green/10 to-app-teal/10'}
              `}>
                <CardTitle className="text-xl flex items-center justify-center gap-2 text-center">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-200">
                    {section.icon}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 pb-4 flex-grow text-center">
                <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
                <p className="text-sm text-gray-600">
                  {section.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
