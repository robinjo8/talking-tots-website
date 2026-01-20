import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { 
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
      title: 'Razvoj govora',
      description: 'Odkrijte, kako se govor razvija pri otrocih od rojstva do šolskega obdobja. Razumejte ključne mejnike in prepoznajte, kdaj je potrebna strokovna pomoč.',
      icon: sectionIcons.development,
      articleUrl: '/clanki/razvoj-govora',
      available: true,
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

  const handleSectionSelect = (section: any) => {
    if (section.available && section.articleUrl) {
      navigate(section.articleUrl);
    } else {
      alert('Ta vsebina bo na voljo kmalu!');
    }
  };

  // Pick the backPath depending on if previous page is available.
  // Fallback to "/" for logged-out users.
  const backPath = "/moja-stran";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-6xl mx-auto pt-28 md:pt-32 pb-20 px-4">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            Logopedski nasveti
          </h1>
          <div className="w-32 h-1 bg-app-yellow mx-auto rounded-full"></div>
        </div>
        
        {/* Breadcrumb */}
        <div className="mb-8">
          <BreadcrumbNavigation />
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contentSections.map((section) => (
            <div
              key={section.id}
              className="bg-card rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
              onClick={() => handleSectionSelect(section)}
            >
              {/* Card Image */}
              <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-app-blue/20 to-app-teal/20">
                {section.id === 'development' ? (
                  <img
                    src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/logopedski-koticek/logoped_slika_1.webp"
                    alt={section.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-6xl opacity-20">
                      {section.icon}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-app-blue transition-colors">
                  {section.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {section.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogopedskiKoticek;
