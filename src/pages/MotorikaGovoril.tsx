import Header from "@/components/Header";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";

const MotorikaGovoril = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Page Title and Breadcrumb */}
      <div className="container max-w-4xl mx-auto px-4 pt-28 md:pt-32 pb-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-6">
          Motorika govoril in artikulacija – razumevanje povezave
        </h1>
        
        {/* Breadcrumb */}
        <div className="mb-4">
          <BreadcrumbNavigation />
        </div>
      </div>

      {/* Blog Article */}
      <article className="container max-w-4xl mx-auto px-4 pb-20">

        {/* Hero Section: Image floats left, text wraps around */}
        <div className="mb-10 clearfix">
          {/* Featured Image - Float left */}
          <div className="md:float-left md:w-1/2 md:mr-8 mb-6 md:mb-4">
            <div className="rounded-2xl overflow-hidden shadow-lg border-4 border-muted">
              <img
                src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/logopedski-koticek/Motorika%20govoril%20in%20artikulacija_razumevanje%20povezave_clanek.webp"
                alt="Motorika govoril in artikulacija"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Intro Paragraph - Wrap around image */}
          <p className="text-base md:text-lg leading-relaxed text-foreground/80 font-light mb-4 text-justify">
            V logopediji sta izraza motorika govoril in artikulacija tesno povezana, vendar označujeta različne vidike govora.
          </p>
        </div>

        {/* Section: Motorika govoril */}
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 pb-2 border-b-2 border-muted">
            Motorika govoril
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-foreground/70 text-justify mb-4">
            Motorika govoril se nanaša na fiziologijo gibov: kako se mišice čeljusti, ustnic, jezika in mehkega neba napnejo ter sprostijo, da pride do gibov, ki omogočajo govor, hranjenje in mimiko. Vaje motorike govoril vključujejo vaje za izpihovanje, vaje za mehko nebo, vaje za jezik in vaje za gibljivost ustnic. Stabilen trup, pravilna drža in usklajeno gibanje mišičnih skupin pa omogočajo natančno delo govorilom.
          </p>
          <p className="text-base md:text-lg leading-relaxed text-foreground/70 text-justify mb-4">
            Kar je pomembno poudariti je dejstvo, da se oralne veščine razvijajo že pred pojavom oglašanja in govora. Sam razvoj oralne motorike se začne že pri rojstvu; dojenček najprej obvlada sesalni refleks, nato sledi griženje in požiranje, med devetim in dvanajstim mesecem pa se razvije rotacijsko žvečenje (spodnja čeljust krožno zmelje hrano med spodnjimi in zgornjimi zobmi, nato jo premakne na drugo stran). V prvih štirih letih se otrok uči vedno bolj zapletenih vzorcev žvečenja, gibanja jezika in ustnic ter koordinacije dihanja in fonacije, kar je temelj za kasnejšo pravilno izreko besed.
          </p>
          <p className="text-base md:text-lg leading-relaxed text-foreground/70 text-justify">
            Motnje na področju motorike govoril so lahko posledica strukturalnih posebnosti, nevroloških ali drugih okvar, neprimernih navad ali slabega govornega modela. Slaba motorika se odraža v napačni izreki glasov, težavah pri hranjenju ter nosnem govoru, kar vpliva na otrokovo razumevanje in izražanje.
          </p>
        </section>

        {/* Section: Artikulacija */}
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 pb-2 border-b-2 border-muted">
            Artikulacija
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-foreground/70 text-justify mb-4">
            Artikulacija pa opisuje mehaniko oblikovanja posameznih glasov; to so položaji čeljusti, ustnic, jezika in mehkega neba med samo tvorbo glasov. Artikulacijska sposobnost je zato zmožnost pravilne tvorbe glasov, npr. da otrok ustvari glas /s/ s pravim položajem jezika za spodnjimi zobmi in z usmerjenim izpihom zraka.
          </p>
          <p className="text-base md:text-lg leading-relaxed text-foreground/70 text-justify">
            Vaje artikulacije so priporočljive za vse otroke, ki imajo težave z izgovorjavo določenih glasov. Vaje motorike govoril pa se izvajajo s tistimi otroki, pri katerih je razvidna šibkejša motorika govoril (npr. otrok ne more dvigniti jezika ne trdo nebo, ga premikati od levega do desnega kotička ustnic…ipd.).
          </p>
        </section>

        {/* Section: Vloga staršev */}
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 pb-2 border-b-2 border-muted">
            Vloga staršev
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-foreground/70 text-justify">
            Starši imajo ključno vlogo pri spodbujanju govora z ustreznim govornim modelom, vključevanjem otroka v vsakdanje dejavnosti, igro, branjem in poslušanjem pravljic ter pesmic lahko ustvarijo podporno okolje, ki dopolnjuje strokovno obravnavo. S sodelovanjem logopeda, staršev in po potrebi drugih strokovnjakov je mogoče doseči občutno izboljšanje govora in s tem kakovosti življenja otroka.
          </p>
        </section>

        {/* Viri in literatura */}
        <section className="border-t-2 border-muted pt-10 mt-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Viri in literatura</h2>
          <ul className="space-y-3 text-base md:text-lg leading-relaxed text-foreground/60 text-justify">
            <li>• Alhaidary, A. (2019). Treatment of speech sound disorders in children: Nonspeech oral exercises. International Journal of Pediatrics & Adolescent Medicine, 8(1), 1–4.</li>
            <li>• Bahr, D. (2010). Nobody ever told me (or my mother) that! Everything from Bottles and Breathing to Healthy Speech Development. Canada, Publication services, inc.</li>
            <li>• Grilc, N. (2013). Govorno-jezikovne motnje. Ljubljana, ZRSŠ.</li>
            <li>• Kutest Kids (2024). The impact of oral motor skills on communication. Blog kutestkids.com.</li>
            <li>• Marshalla, P. (2015). Differentiating articulation, phonology and oral motor. Pam Marshalla's Therapy Answers.</li>
            <li>• Marshalla, P. (2015). Explaining "Articulation" and "Oral Motor". Marshalla Speech & Language.</li>
            <li>• Speech Therapy PD (2024). Glossary – Oral‑motor skills.</li>
            <li>• Stephanie Sigal M.A. CCC‑SLP (2010). Fine motor delay and speech delay correlation. Say and Play Family.</li>
          </ul>
        </section>
      </article>
    </div>
  );
};

export default MotorikaGovoril;
