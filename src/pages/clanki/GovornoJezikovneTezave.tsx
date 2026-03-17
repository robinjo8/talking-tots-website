import Header from "@/components/Header";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const GovornoJezikovneTezave = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumb */}
      <div className="pt-24 md:pt-28">
        <BreadcrumbNavigation />
      </div>

      {/* Page Title */}
      <div className="container max-w-4xl mx-auto px-4 pt-4 pb-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-6">
          Kako govorno-jezikovne težave vplivajo na psihološko stanje otroka?
        </h1>
      </div>

      {/* Blog Article */}
      <article className="container max-w-4xl mx-auto px-4 pb-20">

        {/* Hero Section: Image floats left, text wraps around */}
        <div className="mb-10 clearfix">
          {/* Featured Image - Float left */}
          <div className="md:float-left md:w-1/2 md:mr-8 mb-6 md:mb-4">
            <div className="rounded-2xl overflow-hidden shadow-lg border-4 border-muted">
              <img
                src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/logopedski-koticek/Kako%20gov-jez%20tezave%20vplivajo%20na%20psh%20Kako%20lahko%20pomagam.png"
                alt="Kako govorno-jezikovne težave vplivajo na psihološko stanje otroka"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Intro Paragraph - Wrap around image */}
          <p className="text-base md:text-lg leading-relaxed text-foreground/80 font-light mb-4 text-justify">
            Poznamo različne govorno-jezikovne motnje - govorne motnje zajemajo težave z artikulacijo in jasno izgovorjavo glasov, jezikovne motnje so težave z razumevanjem in strukturiranjem jezika, ponavadi tako v govoru kot pisanju ter motnje tekočnosti, ki vključujejo različne vrste zatikanja. Pri otrocih z govorno-jezikovnimi motnjami razvoj ne poteka spontano in po naravni poti, kljub normalnemu sluhu in intelektualnim sposobnostim. Pogosto imajo ti otroci tudi težave s koncentracijo, spominom, socialno interakcijo …
          </p>
        </div>

        {/* Section: Vpliv na psihološko stanje */}
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 pb-2 border-b-2 border-muted">
            Vpliv na psihološko in čustveno stanje
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-foreground/70 text-justify mb-4">
            Težave z govorom lahko vplivajo na otrokovo psihološko in čustveno stanje – ne same po sebi, ampak predvsem preko tega, kako otrok zaradi njih doživlja sebe in odnose z drugimi. Vpliv je zelo različen glede na vrsto težav, otrokovo osebnost, podporo okolja in odzive odraslih. Govor in jezik sta temelj za izražanje čustev, povezovanje z vrstniki in uspešno vključevanje v šolsko in družbeno okolje.
          </p>
          <p className="text-base md:text-lg leading-relaxed text-foreground/70 text-justify">
            Otroci z govorno-jezikovnimi motnjami se lahko soočajo z občutki frustracije in jeze zaradi nemoči pri izražanju, lahko imajo nižjo samozavest in občutek "drugačnosti", doživljajo strah pred govorjenjem v javnosti ali v družbi. Z vidika socialne komunikacije se lahko zgodi, da težje sklepajo in ohranjajo prijateljstva, se umikajo iz socialnih situacij, kjer bi morali govoriti in doživljajo nerazumevanje s strani vrstnikov ali odraslih. Pri učnem procesu se lahko kažejo težave pri razumevanju navodil, strukturiranju povedi ali izražanju znanja, kar lahko vodi v slabši učni uspeh, težav pri branju in pisanju ter do občutkov neuspeha in nizke samozavesti pri šolskih aktivnostih. Ker otroci ne najdejo ustreznih načinov za izražanje misli in potreb, se lahko frustracija in nerazumevanje izrazita skozi vedenje (izbruhi jeze ali agresivno vedenje, hiperaktivnost ali impulzivnost, pretirana pasivnost ali umik v samoto).
          </p>
        </section>

        {/* Section: Tveganje */}
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 pb-2 border-b-2 border-muted">
            Tveganje za psihološke stiske
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-foreground/70 text-justify">
            Tveganje za psihološke stiske se poveča predvsem takrat, ko otrok ostane brez ustrezne pomoči, je pogosto kritiziran ali zasmehovan, se njegove težave ne minimalizirajo ("saj bo minilo").
          </p>
        </section>

        {/* Section: Pozitivni dejavniki */}
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 pb-2 border-b-2 border-muted">
            Pozitivni dejavniki
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-foreground/70 text-justify">
            Pozitivni dejavniki, ki lahko omilijo negativne učinke govorno-jezikovnih težav, vključujejo zgodnjo obravnavo pri logopedu oziroma specialistu, spodbudno in potrpežljivo okolje, kjer otrok lahko uspeva v svojem ritmu, socialne dejavnosti, ki krepijo medosebne veščine, emocionalno podpora staršev, učiteljev in vrstnikov. Dobro razvite socialne veščine lahko delujejo kot zaščitni faktor za razvoj kasnejših vedenjskih in emocionalnih težav pri otrocih z jezikovnimi motnjami.
          </p>
        </section>

        {/* Section: Zaključek */}
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 pb-2 border-b-2 border-muted">
            Zaključek
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-foreground/70 text-justify">
            Govorno-jezikovne težave torej lahko pomembno vplivajo na otrokovo doživljanje sebe, njegov občutek sprejetosti ter uspešnost v socialnem in šolskem okolju. Če otrok zaradi težav pogosto doživlja nerazumevanje, neuspeh ali kritiko, se lahko razvijejo nizka samopodoba, čustvene stiske in vedenjske težave. Podpora okolja je odločilnega pomena. Zgodnja strokovna pomoč ter razumevajoči, spodbudni odrasli in vrstniki lahko bistveno omilijo negativne posledice ter otroku omogočijo, da kljub težavam razvije samozavest, občutek kompetentnosti in zdrave odnose.
          </p>
        </section>

        {/* Viri in literatura */}
        <section className="border-t-2 border-muted pt-10 mt-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Viri in literatura</h2>
          <ul className="space-y-3 text-base md:text-lg leading-relaxed text-foreground/60 text-justify">
            <li>• Marot, V., Jelenc, N., & Korošec, B. (2018). Govorne motnje v otroštvu: Razvrščanje govornih motenj pri slovenskih otrocih. Rehabilitacija (Ljubljana), 17(2), 51–59. https://www.dlib.si/details/URN%3ANBN%3ASI%3Adoc-H5B7H8TT</li>
            <li>• Bobnar, E., & Vrhovski Mohorič, M. (2025). Spodbujanje razvoja teorije uma pri otroku z govorno-jezikovnimi motnjami. Vzgoja in izobraževanje, 6/2025, 26–30. https://www.zrss.si/arhiv_clankov/spodbujanje-razvoja-teorije-uma-pri-otroku-z-govorno-jezikovnimi-motnjami/</li>
            <li>• Xue, L., Gong, Y., Pill, S. & Han, W. (2025). Study on language difficulties and psychological effects. PMC. https://pmc.ncbi.nlm.nih.gov/articles/PMC12346834/</li>
            <li>• American Speech-Language-Hearing Association. (2020). Definitions of communication disorders and variations. ASHA. https://www.asha.org/policy/RP1993-00208/</li>
          </ul>
        </section>
      </article>

      {/* Mobile Back Button */}
      {isMobile && (
        <button
          onClick={() => navigate("/logopedski-koticek")}
          className="fixed bottom-4 left-4 z-50 rounded-full w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg border-2 border-white/50 backdrop-blur-sm flex items-center justify-center transition-all"
        >
          <ArrowLeft className="w-7 h-7 text-white" />
        </button>
      )}
    </div>
  );
};

export default GovornoJezikovneTezave;
