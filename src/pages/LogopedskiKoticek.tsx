
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Baby, 
  AlertTriangle, 
  Heart, 
  Home, 
  HelpCircle, 
  BookOpen, 
  ExternalLink 
} from "lucide-react";

const LogopedskiKoticek = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Map of section IDs to their corresponding Lucide icons
  const sectionIcons = {
    development: <Baby className="h-6 w-6 text-app-blue" />,
    disorders: <AlertTriangle className="h-6 w-6 text-app-orange" />,
    parent_tips: <Heart className="h-6 w-6 text-app-purple" />,
    home_activities: <Home className="h-6 w-6 text-app-teal" />,
    faq: <HelpCircle className="h-6 w-6 text-dragon-green" />,
    articles: <BookOpen className="h-6 w-6 text-app-yellow" />,
    resources: <ExternalLink className="h-6 w-6 text-app-blue" />
  };

  const contentSections = [
    {
      id: 'development',
      title: 'Govorni razvoj po starostnih obdobjih',
      description: 'Pregled tipičnega govornega razvoja otrok od 1. do 6. leta starosti. Mejniki v razvoju govora in jezika ter kdaj je priporočljivo poiskati pomoč logopeda.',
      icon: sectionIcons.development,
      gradient: 'bg-gradient-to-r from-app-blue/10 to-app-teal/10'
    },
    {
      id: 'disorders',
      title: 'Najpogostejše govorne motnje',
      description: 'Opis in razlaga motenj, kot so: Dislalija, Fonološke motnje, Jecljanje, Zakasnitev v govoru. Vključitev primerov in nasvetov za prepoznavanje teh motenj.',
      icon: sectionIcons.disorders,
      gradient: 'bg-gradient-to-r from-app-orange/10 to-app-yellow/10'
    },
    {
      id: 'parent_tips',
      title: 'Nasveti za starše',
      description: 'Kako doma spodbujati razvoj govora pri otroku. Vključitev vsakodnevnih dejavnosti, ki lahko pomagajo pri govornem razvoju. Pomembnost igre in interakcije pri učenju jezika.',
      icon: sectionIcons.parent_tips,
      gradient: 'bg-gradient-to-r from-app-purple/10 to-app-blue/10'
    },
    {
      id: 'home_activities',
      title: 'Vaje in dejavnosti za domačo uporabo',
      description: 'Predlogi za enostavne vaje, ki jih starši lahko izvajajo z otroki doma. Uporaba pesmi, rim in zgodbic za spodbujanje govora. Ustvarjalne dejavnosti, kot so risanje in igranje vlog, ki spodbujajo jezikovni razvoj.',
      icon: sectionIcons.home_activities,
      gradient: 'bg-gradient-to-r from-app-teal/10 to-dragon-green/10'
    },
    {
      id: 'faq',
      title: 'Pogosta vprašanja in odgovori',
      description: 'Odgovori na najpogostejša vprašanja staršev glede govornega razvoja. Nasveti, kako ravnati v določenih situacijah, npr. če otrok ne govori ali ima težave z izgovorjavo določenih glasov.',
      icon: sectionIcons.faq,
      gradient: 'bg-gradient-to-r from-dragon-green/10 to-app-teal/10'
    },
    {
      id: 'articles',
      title: 'Strokovni članki in raziskave',
      description: 'Povzetki najnovejših raziskav na področju logopedije. Članki strokovnjakov o različnih vidikih govornega razvoja in terapije.',
      icon: sectionIcons.articles,
      gradient: 'bg-gradient-to-r from-app-yellow/10 to-dragon-green/10'
    },
    {
      id: 'resources',
      title: 'Povezave do dodatnih virov',
      description: 'Seznam priporočenih knjig, spletnih strani in aplikacij za podporo govornemu razvoju. Informacije o lokalnih logopedskih storitvah in podpornih skupinah.',
      icon: sectionIcons.resources,
      gradient: 'bg-gradient-to-r from-app-blue/10 to-app-purple/10'
    }
  ];

  const handleSectionSelect = (sectionId: string) => {
    // For now, show a "coming soon" message for all sections
    alert('Ta vsebina bo na voljo kmalu!');
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
            Logopedski kotiček
          </h1>
        </div>
        
        <p className="text-muted-foreground mb-8">
          Strokovne informacije, nasveti in viri za podporo govornemu razvoju vašega otroka.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {contentSections.map((section) => (
            <Card 
              key={section.id} 
              className="transition-all duration-300 hover:shadow-md cursor-pointer"
              onClick={() => handleSectionSelect(section.id)}
            >
              <CardHeader className={section.gradient}>
                <CardTitle className="text-xl flex items-start gap-3">
                  <span className="flex items-center justify-center" aria-label={section.title}>
                    {section.icon}
                  </span>
                  <div>
                    {section.title}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">
                  {section.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogopedskiKoticek;
