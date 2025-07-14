import { useIsMobile } from "@/hooks/use-mobile";

export const TargetAudienceSection = () => {
  const isMobile = useIsMobile();

  const audiences = [
    {
      title: "LOGOPEDOM",
      subtitle: "Prednosti za logopede:",
      benefits: [
        "Avtomatizirana analiza govora za lažjo diagnostiko.",
        "Personalizirane vaje in igre za individualno prilagojeno terapijo.",
        "Objektivno spremljanje napredka, kar poveča učinkovitost terapije.",
        "Zgodnje prepoznavanje spremljajočih psihosocialnih težav.",
        "Več časa za neposredno delo z otrokom in učinkovitejše terapije."
      ],
      bgColor: "bg-gradient-to-br from-app-blue/10 to-app-teal/10",
      titleColor: "text-app-blue"
    },
    {
      title: "DRUŽINAM",
      subtitle: "Prednosti za družine:",
      benefits: [
        "Hitrejši in opaznejši napredek pri govornem razvoju.",
        "Otroci z veseljem izvajajo vaje v obliki zabavnih iger.",
        "Manjša verjetnost razvoja psihosocialnih težav (tesnoba, nizka samozavest, socialna izolacija).",
        "Večja povezanost staršev in otrok preko skupnih aktivnosti.",
        "Konstantna strokovna podpora ter praktični nasveti za starše."
      ],
      bgColor: "bg-gradient-to-br from-dragon-green/10 to-app-teal/10",
      titleColor: "text-dragon-green"
    },
    {
      title: "VRTCEM",
      subtitle: "Prednosti za vrtce:",
      benefits: [
        "Zgodnja in učinkovita identifikacija govornih težav pri otrocih.",
        "Enostavna vključitev govornih aktivnosti v vsakodnevne rutine vrtca.",
        "Izboljšanje komunikacije, socializacije in vključevanja otrok v vrstniške skupine.",
        "Manjša verjetnost psihosocialnih težav in boljša splošna klima v skupini.",
        "Bolj zadovoljni starši, ki cenijo kakovostno obravnavo otrok v vašem vrtcu."
      ],
      bgColor: "bg-gradient-to-br from-app-orange/10 to-app-yellow/10",
      titleColor: "text-app-orange"
    }
  ];

  return (
    <section className="py-14 px-4 md:px-10 bg-background w-full">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Komu je TomiTalk namenjen
          </h2>
        </div>
        
        <div className={`${isMobile ? 'flex flex-col space-y-6' : 'grid grid-cols-3 gap-6'}`}>
          {audiences.map((audience, index) => (
            <div 
              key={index} 
              className={`${audience.bgColor} rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 md:p-8 h-full flex flex-col border border-gray-100`}
            >
              {/* Title */}
              <div className="text-center mb-6">
                <h3 className={`text-xl md:text-2xl font-bold ${audience.titleColor} mb-2`}>
                  {audience.title}
                </h3>
                <p className="text-gray-700 font-semibold text-base md:text-lg">
                  {audience.subtitle}
                </p>
              </div>
              
              {/* Benefits List */}
              <div className="flex-grow">
                <ul className="space-y-3">
                  {audience.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-start">
                      <div className={`w-2 h-2 rounded-full ${audience.titleColor.replace('text-', 'bg-')} flex-shrink-0 mt-2 mr-3`}></div>
                      <span className="text-gray-700 text-sm md:text-base leading-relaxed">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};