import { useEffect } from "react";
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
  const navigate = useNavigate();

  // NOTE: We do NOT redirect or require auth here!
  // Optionally allow guests and users.
  // Use sessionStorage to optionally check redirectAfterLogin,
  // but generally just show the page.

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
    },
    {
      id: 'disorders',
      title: 'Najpogostejše govorne motnje',
      description: 'Opis in razlaga motenj, kot so: Dislalija, Fonološke motnje, Jecljanje, Zakasnitev v govoru. Vključitev primerov in nasvetov za prepoznavanje teh motenj.',
      icon: sectionIcons.disorders,
    },
    {
      id: 'parent_tips',
      title: 'Nasveti za starše',
      description: 'Kako doma spodbujati razvoj govora pri otroku. Vključitev vsakodnevnih dejavnosti, ki lahko pomagajo pri govornem razvoju. Pomembnost igre in interakcije pri učenju jezika.',
      icon: sectionIcons.parent_tips,
    },
    {
      id: 'home_activities',
      title: 'Vaje in dejavnosti za domačo uporabo',
      description: 'Predlogi za enostavne vaje, ki jih starši lahko izvajajo z otroki doma. Uporaba pesmi, rim in zgodbic za spodbujanje govora. Ustvarjalne dejavnosti, kot so risanje in igranje vlog, ki spodbujajo jezikovni razvoj.',
      icon: sectionIcons.home_activities,
    },
    {
      id: 'faq',
      title: 'Pogosta vprašanja in odgovori',
      description: 'Odgovori na najpogostejše vprašanja staršev glede govornega razvoja. Nasveti, kako ravnati v določenih situacijah, npr. če otrok ne govori ali ima težave z izgovorjavo določenih glasov.',
      icon: sectionIcons.faq,
    },
    {
      id: 'articles',
      title: 'Strokovni članki in raziskave',
      description: 'Povzetki najnovejših raziskav na področju logopedije. Članki strokovnjakov o različnih vidikih govornega razvoja in terapije.',
      icon: sectionIcons.articles,
    },
    {
      id: 'resources',
      title: 'Povezave do dodatnih virov',
      description: 'Seznam priporočenih knjig, spletnih strani in aplikacij za podporo govornemu razvoju. Informacije o lokalnih logopedskih storitvah in podpornih skupinah.',
      icon: sectionIcons.resources,
    }
  ];

  const handleSectionSelect = (sectionId: string) => {
    // For now, show a "coming soon" message for all sections
    alert('Ta vsebina bo na voljo kmalu!');
  };

  // Pick the backPath depending on if previous page is available.
  // Fallback to "/" for logged-out users.
  const backPath = "/moja-stran";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-5xl mx-auto pt-28 md:pt-32 pb-20 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {contentSections.map((section) => (
            <Card 
              key={section.id} 
              className="transition-all duration-300 hover:shadow-lg rounded-2xl border-2 border-gray-200 cursor-pointer h-full flex flex-col"
              onClick={() => handleSectionSelect(section.id)}
            >
              <CardHeader className={`
                rounded-t-2xl pb-4
                ${section.id === 'development' && 'bg-gradient-to-r from-app-blue/10 to-app-teal/10'}
                ${section.id === 'disorders' && 'bg-gradient-to-r from-app-orange/10 to-app-yellow/10'}
                ${section.id === 'parent_tips' && 'bg-gradient-to-r from-app-purple/10 to-app-blue/10'}
                ${section.id === 'home_activities' && 'bg-gradient-to-r from-app-teal/10 to-dragon-green/10'}
                ${section.id === 'faq' && 'bg-gradient-to-r from-dragon-green/10 to-app-teal/10'}
                ${section.id === 'articles' && 'bg-gradient-to-r from-app-yellow/10 to-dragon-green/10'}
                ${section.id === 'resources' && 'bg-gradient-to-r from-app-blue/10 to-app-purple/10'}
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
};

export default LogopedskiKoticek;
