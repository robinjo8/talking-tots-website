import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { WavyDivider } from "./WavyDivider";

export const TargetAudienceSection = () => {
  const isMobile = useIsMobile();
  const audiences = [{
    title: "LOGOPEDOM",
    subtitle: "Prednosti za logopede:",
    benefits: ["Test preverjanja izgovorjave glasov omogoča avtomatizirano analizo govora za učinkovito obravnavo", "Personalizirane vaje in igre za individualno prilagojeno terapijo.", "Objektivno spremljanje napredka, kar poveča učinkovitost terapije.", "Uporabno kot dopolnilo v ordinaciji ali kot vodeno delo za domačo vadbo.", "Več časa za neposredno delo z otrokom in učinkovitejše terapije."],
    bgColor: "bg-white",
    titleColor: "text-app-blue"
  }, {
    title: "DRUŽINAM",
    subtitle: "Prednosti za družine:",
    benefits: ["Hitrejši in opaznejši napredek pri govornem razvoju.", "Otroci z veseljem izvajajo vaje v obliki zabavnih iger.", "Izboljša čustveno stabilnost in socialne veščine, kar zmanjšuje verjetnost pojava tesnobe in nizke samopodobe.", "Večja povezanost staršev in otrok preko skupnih aktivnosti.", "Konstantna strokovna podpora ter praktični nasveti za starše."],
    bgColor: "bg-white",
    titleColor: "text-dragon-green"
  }, {
    title: "VRTCEM",
    subtitle: "Prednosti za vrtce:",
    benefits: ["Zgodnja in učinkovita identifikacija govornih težav pri otrocih.", "Enostavna vključitev govornih aktivnosti v vsakodnevne rutine vrtca.", "Izboljšanje komunikacije, socializacije in vključevanja otrok v vrstniške skupine.", "Manjša verjetnost psihosocialnih težav in boljša splošna klima v skupini.", "Bolj zadovoljni starši, ki cenijo kakovostno obravnavo otrok v vašem vrtcu."],
    bgColor: "bg-white",
    titleColor: "text-app-orange"
  }];
  return <section className="relative py-14 px-4 md:px-10 bg-white w-full">
      <WavyDivider color="green" position="top" flip={true} />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Komu je namenjeno?</h2>
        </div>
        
        {isMobile ?
      // Mobile: Tab interface
      <Tabs defaultValue="DRUŽINAM" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              {audiences.map(audience => <TabsTrigger key={audience.title} value={audience.title} className="text-xs sm:text-sm font-medium">
                  {audience.title}
                </TabsTrigger>)}
            </TabsList>
            
            {audiences.map(audience => <TabsContent key={audience.title} value={audience.title}>
                <div className={`${audience.bgColor} rounded-xl shadow-md p-6 border border-gray-100`}>
                  {/* Title */}
                  <div className="text-center mb-6">
                    <h3 className={`text-xl font-bold ${audience.titleColor} mb-2`}>
                      {audience.title}
                    </h3>
                    <p className="text-gray-700 font-semibold text-base">
                      {audience.subtitle}
                    </p>
                  </div>
                  
                  {/* Benefits List */}
                  <div>
                    <ul className="space-y-3">
                      {audience.benefits.map((benefit, benefitIndex) => <li key={benefitIndex} className="flex items-start">
                          <div className={`w-2 h-2 rounded-full ${audience.titleColor.replace('text-', 'bg-')} flex-shrink-0 mt-2 mr-3`}></div>
                          <span className="text-gray-700 text-sm leading-relaxed">
                            {benefit}
                          </span>
                        </li>)}
                    </ul>
                  </div>
                </div>
              </TabsContent>)}
          </Tabs> :
      // Desktop: Grid layout
      <div className="grid grid-cols-3 gap-6">
            {audiences.map((audience, index) => <div key={index} className={`${audience.bgColor} rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-8 h-full flex flex-col border border-gray-100`}>
                {/* Title */}
                <div className="text-center mb-6">
                  <h3 className={`text-2xl font-bold ${audience.titleColor} mb-2`}>
                    {audience.title}
                  </h3>
                  <p className="text-gray-700 font-semibold text-lg">
                    {audience.subtitle}
                  </p>
                </div>
                
                {/* Benefits List */}
                <div className="flex-grow">
                  <ul className="space-y-3">
                    {audience.benefits.map((benefit, benefitIndex) => <li key={benefitIndex} className="flex items-start">
                        <div className={`w-2 h-2 rounded-full ${audience.titleColor.replace('text-', 'bg-')} flex-shrink-0 mt-2 mr-3`}></div>
                        <span className="text-gray-700 text-base leading-relaxed">
                          {benefit}
                        </span>
                      </li>)}
                  </ul>
                </div>
              </div>)}
          </div>}
      </div>
    </section>;
};