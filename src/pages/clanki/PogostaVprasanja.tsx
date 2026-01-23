import Header from "@/components/Header";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";

const PogostaVprasanja = () => {
  const faqData = [
    {
      question: "Kaj je TomiTalk in komu je namenjen?",
      answer: "TomiTalk je prva slovenska aplikacija, ki s pomočjo umetne inteligence pomaga otrokom odpraviti govorno-jezikovne težave. Namenjena je družinam, logopedom in vrtcem. Aplikacija omogoča prilagojene vaje in igre glede na otrokovo starost in specifično težavo."
    },
    {
      question: "Katere govorne težave obravnava aplikacija?",
      answer: "TomiTalk obravnava najpogostejše govorne težave otrok, kot so napačna izgovorjava določenih glasov (npr. R, L, S), težave z artikulacijo, govorno motoriko in druge razvojne govorne motnje."
    },
    {
      question: "Kakšne vrste vaj in iger vključuje TomiTalk?",
      answer: "Aplikacija vključuje interaktivne igre in vaje, kot so igre spomin, sestavljanke, ponavljanje besed s pomočjo zvočnih posnetkov, igre za vadbo artikulacije in motorike govoril ter igre za splošno krepitev govornega razvoja in samozavesti otrok."
    },
    {
      question: "Kako TomiTalk spremlja otrokove rezultate in napredek?",
      answer: "Aplikacija beleži vsakodnevne rezultate vaj in iger, analizira napredek v primerjavi s standardi logopedske stroke, staršem pa omogoča pregledno spremljanje izboljšav skozi čas v razdelku »Moj napredek«."
    },
    {
      question: "V čem še TomiTalk razlikuje od drugih logopedskih metod (javno zdravstvo, samoplačniško,...)?",
      answer: "Glavne prednosti TomiTalk-a so dostopnost kadarkoli in kjerkoli, takojšen začetek obravnave brez čakalnih dob, vsakodnevne vaje, stalno spremljanje napredka, motivacija prek zabavnih iger ter ugodna cena. Za ceno le 1,5 obiska pri samoplačniškem logopedu prejmete celoletno naročnino na TomiTalk."
    },
    {
      question: "Ali aplikacija omogoča podporo logopedov?",
      answer: "Da, TomiTalk ponuja strokovno podporo logopedov, video navodila za pravilno izvajanje vaj ter strokovne članke v razdelkih »Logopedski nasveti« in »Blog«."
    },
    {
      question: "Kako varen je TomiTalk za uporabo?",
      answer: "Aplikacija je zasnovana posebej za otroke od 3 do 10 let, zagotavlja varno okolje brez oglasov in neprimernih vsebin. Vsi podatki otrok in družin so zaščiteni in varno shranjeni."
    },
    {
      question: "Kako pogosto naj otrok uporablja TomiTalk za najboljše rezultate?",
      answer: "Priporočamo vsakodnevno uporabo aplikacije vsaj do 30 minut. Redna vadba zagotavlja hitrejši napredek pri odpravljanju govornih težav. Takšna aktivna uporaba bistveno razlikuje od pasivnega preživljanja časa pred zasloni, kot je gledanje risank ali drugih manj koristnih vsebin. Redna, kratka in ciljno usmerjena vadba prinaša največji napredek pri odpravljanju govornih težav."
    },
    {
      question: "Ali potrebujem posebne pripomočke ali opremo za uporabo aplikacije?",
      answer: "Ne, za uporabo aplikacije potrebujete le pametni telefon, tablico ali računalnik z mikrofonom in internetno povezavo. Aplikacija vse ostalo zagotovi sama."
    },
    {
      question: "Ali lahko starši spremljajo, katere vaje otrok izvaja?",
      answer: "Seveda! Starši imajo v zavihku »Moja stran« popoln pregled nad vajami, ki jih je otrok opravil, in nad njegovim vsakodnevnim napredkom."
    }
  ];

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
          Pogosta vprašanja in odgovori
        </h1>
      </div>

      {/* Article Content */}
      <article className="container max-w-4xl mx-auto px-4 pb-20">
        {/* Hero Image */}
        <div className="mb-10">
          <img
            src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/Stickman_FAQ.webp"
            alt="Pogosta vprašanja in odgovori"
            className="w-full max-w-md mx-auto rounded-2xl shadow-lg"
          />
        </div>

        {/* Intro */}
        <div className="prose prose-lg max-w-none mb-10">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Na tej strani smo zbrali najpogostejša vprašanja, ki jih starši in skrbniki zastavljajo o aplikaciji TomiTalk. 
            Od osnovnih informacij o namenu aplikacije do podrobnosti o vajah, napredku in varnosti – tukaj najdete odgovore 
            na vse, kar vas zanima.
          </p>
        </div>

        {/* FAQ as text document */}
        <div className="space-y-8">
          {faqData.map((faq, index) => (
            <div key={index} className="space-y-2">
              <h3 className="text-lg font-bold text-foreground">
                {faq.question}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 p-6 bg-muted/30 rounded-xl text-center">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Niste našli odgovora na vaše vprašanje?
          </h3>
          <p className="text-muted-foreground mb-4">
            Pišite nam na <a href="mailto:info@tomitalk.si" className="text-primary hover:underline">info@tomitalk.si</a> in z veseljem vam bomo pomagali.
          </p>
        </div>
      </article>
    </div>
  );
};

export default PogostaVprasanja;
