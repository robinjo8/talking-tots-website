import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {

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
      question: "V čem se TomiTalk razlikuje od logopedske obravnave v javnem in zasebnem sektorju?",
      answer: "Glavne prednosti TomiTalk-a so dostopnost kadarkoli in kjerkoli, takojšen začetek obravnave brez čakalnih dob, vsakodnevne vaje, stalno spremljanje napredka, motivacija prek zabavnih iger ter ugodna cena. Za ceno le 1,5 obiska pri samoplačniškem logopedu prejmete celoletno naročnino na TomiTalk."
    },
    {
      question: "Ali aplikacija omogoča podporo logopedov?",
      answer: "Da, TomiTalk ponuja strokovno podporo logopedov, video navodila za pravilno izvajanje vaj ter strokovne članke v razdelkih »Logopedski kotiček« in »Blog«."
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
    <section className="py-16 bg-light-cloud">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Pogosta vprašanja
          </h2>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border border-border rounded-lg shadow-sm"
              >
                <AccordionTrigger className="w-full px-6 py-4 text-left hover:bg-muted/50 transition-colors duration-200 rounded-lg [&[data-state=open]>div>svg]:rotate-180">
                  <div className="flex items-center justify-between w-full">
                    <h3 className="text-lg font-semibold text-card-foreground pr-4">
                      {faq.question}
                    </h3>
                  </div>
                </AccordionTrigger>
                
                <AccordionContent>
                  <div className="px-6 pb-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;