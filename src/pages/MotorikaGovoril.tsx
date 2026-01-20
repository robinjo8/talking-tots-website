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
                src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/logopedski-koticek/Motorika_govoril_slika.png"
                alt="Motorika govoril in artikulacija"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Intro Paragraphs - Wrap around image */}
          <p className="text-base md:text-lg leading-relaxed text-foreground/80 font-light mb-4 text-justify">
            Testni članek - uvodni odstavek. To je testna vsebina, ki bo nadomeščena s pravo vsebino članka 
            o motoriki govoril in artikulaciji. Motorika govoril zajema gibanje vseh struktur, ki sodelujejo 
            pri tvorbi govora.
          </p>
          <p className="text-base md:text-lg leading-relaxed text-foreground/80 font-light text-justify">
            Testni članek - drugi odstavek. Artikulacija je proces, pri katerem z usklajenim gibanjem govornih 
            organov (ustnic, jezika, mehkega neba, glasilk) oblikujemo glasove govora.
          </p>
        </div>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 pb-2 border-b-2 border-muted">
            Testna sekcija 1
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-foreground/70 text-justify">
            Testna vsebina za prvo sekcijo članka. Tu bo prava vsebina o motoriki govoril.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 pb-2 border-b-2 border-muted">
            Testna sekcija 2
          </h2>
          <ul className="space-y-3 text-base md:text-lg leading-relaxed text-foreground/70 list-disc list-inside text-justify">
            <li>Testna točka 1</li>
            <li>Testna točka 2</li>
            <li>Testna točka 3</li>
          </ul>
        </section>

        {/* Viri in literatura */}
        <section className="border-t-2 border-muted pt-10 mt-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Viri in literatura</h2>
          <ul className="space-y-3 text-base md:text-lg leading-relaxed text-foreground/60 text-justify">
            <li>• Testni vir 1</li>
            <li>• Testni vir 2</li>
          </ul>
        </section>
      </article>
    </div>
  );
};

export default MotorikaGovoril;
