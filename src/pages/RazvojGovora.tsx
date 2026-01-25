import Header from "@/components/Header";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const RazvojGovora = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Page Title and Breadcrumb */}
      <div className="container max-w-4xl mx-auto px-4 pt-28 md:pt-32 pb-4">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-6">
          Razvoj govora
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
                src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/logopedski-koticek/Razvoj%20govora_clanek.webp"
                alt="Razvoj govora"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Intro Paragraphs - Wrap around image */}
          <p className="text-base md:text-lg leading-relaxed text-foreground/80 font-light mb-4 text-justify">
            Pred pojavom govorno-jezikovne komunikacije je potrebna ustrezno razvita fiziološka podlaga za govor. 
            Ta vključuje razvoj splošne motorike telesa in govornih organov, razvoj slušnega in vidnega zaznavanja, 
            razvoj koncentracije in pozornosti, razvoj kognitivnih sposobnosti, razvoj ustreznega odzivanja telesa 
            z gibi ter na koncu razvoj odzivanja z glasom in govorom.
          </p>
          <p className="text-base md:text-lg leading-relaxed text-foreground/80 font-light text-justify">
            Ključne značilnosti običajnega govorno-jezikovnega razvoja se med posameznimi otroki razlikujejo, 
            lahko pa nam služijo kot pomoč pri spremljanju in učenju pridobivanja glasov, besed, slovničnih prvin 
            ter pojmov, ki jih otrok še ni usvojil.
          </p>
        </div>

        {/* 1 leto */}
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 pb-2 border-b-2 border-gray-200">
            1 leto
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-foreground/70 text-justify">
            Pojavi se prva beseda.
          </p>
        </section>

        {/* 1,5 - 2 leti */}
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 pb-2 border-b-2 border-gray-200">
            1,5 – 2 leti
          </h2>
          <ul className="space-y-3 text-base md:text-lg leading-relaxed text-foreground/70 list-disc list-inside text-justify">
            <li>Otrok se začne izražati v stavkih, sestavljenih iz samostalnika in glagola, na primer <em>Ema pia (pila)</em> ali <em>Tim gaja (nagaja)</em>.</li>
            <li>Do drugega leta ima besedni zaklad približno 200 ali več besed.</li>
            <li>Otrok se odziva na enostavna navodila in razume preprosta vprašanja.</li>
            <li>V govoru uporablja vse samoglasnike in nekatere soglasnike (p, b, m, n, j, t, d).</li>
          </ul>
        </section>

        {/* 3 leta */}
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 pb-2 border-b-2 border-gray-200">
            3 leta
          </h2>
          <ul className="space-y-3 text-base md:text-lg leading-relaxed text-foreground/70 list-disc list-inside text-justify">
            <li>Govor se izpopolni in postane bolj razumljiv okolici.</li>
            <li>Otrok razume in se odziva na enostavna navodila, sestavljena iz več besed, ter razume tudi dvojna navodila (z dvema zahtevama).</li>
            <li>Razume in odgovarja na enostavna vprašanja, začne razumeti predloge, nasprotja, časovne pojme, pridevnike in zaimke.</li>
            <li>Zna pokazati poimenovane dele telesa in dlje časa ohranja slušno pozornost.</li>
            <li>Do tretjega leta obsega besedni zaklad 250–450 besed.</li>
            <li>V govoru uporablja vse samoglasnike in večino soglasnikov (p, b, m, n, j, t, d, k, g, h, f, v).</li>
          </ul>
        </section>

        {/* 4 - 5 let */}
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 pb-2 border-b-2 border-gray-200">
            4 – 5 let
          </h2>
          <ul className="space-y-3 text-base md:text-lg leading-relaxed text-foreground/70 list-disc list-inside text-justify">
            <li>Govor se še naprej izpopolnjuje, nabor besed postaja zelo velik.</li>
            <li>Izgovorjava je vse bolj pravilna, stavki so daljši (štiri do pet besed).</li>
            <li>Otrok uporablja različne besedne vrste – predloge, pridevnike, veznike, prislove in členke.</li>
            <li>Besedni zaklad preseže 1000 besed.</li>
            <li>Razume in uporablja različne slovnične prvine (glagolski čas, število, vprašalnice, pomenke ipd.).</li>
            <li>Otrok rad poje pesmice, govori izštevanke, odgovarja na uganke in razume šale.</li>
            <li>Izgovorjava je večinoma pravilna, občasno so lahko še nepravilno izgovorjeni sičniki, šumniki ter glasova l in r.</li>
          </ul>
        </section>

        {/* Od petega leta naprej */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 pb-2 border-b-2 border-gray-200">
            Od petega leta naprej
          </h2>
          <ul className="space-y-3 text-base md:text-lg leading-relaxed text-foreground/70 list-disc list-inside text-justify">
            <li>Otrokov govor postaja vedno bolj podoben govoru odrasle osebe.</li>
            <li>Besedni zaklad se hitro bogati, izgovorjava je večinoma popolna, otrok pa z govorom izraža tudi čustva, razmišljanja in izkušnje.</li>
          </ul>
        </section>

        {/* Viri in literatura */}
        <section className="border-t-2 border-gray-200 pt-10 mt-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Viri in literatura</h2>
          <ul className="space-y-3 text-base md:text-lg leading-relaxed text-foreground/60 text-justify">
            <li>• Vladisavljević, S. (1973). <em>Patološki nerazvijen govor u dece</em>. Beograd: Savez defektologa Jugoslavije.</li>
            <li>• Grilc, N. (2013). <em>Govorno-jezikovne motnje</em>. Ljubljana: ZRSŠ.</li>
            <li>• Levc, S. (2014). <em>Liba laca lak. Kako pomagamo otroku do boljšega govora</em>. Ljubljana: Samozaložba.</li>
          </ul>
        </section>
      </article>
    </div>
  );
};

export default RazvojGovora;
