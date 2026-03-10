import Header from "@/components/Header";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const helpSections = [
  {
    title: "1. Naročnina",
    items: [
      {
        question: "Kako deluje podaljšanje naročnine?",
        answer:
          "Naročnina se samodejno podaljša ob koncu obračunskega obdobja (mesečno ali letno). O podaljšanju in uspešnem plačilu vas Stripe samodejno obvesti po e-pošti.",
      },
      {
        question: "Kako lahko prekinem naročnino in kaj se zgodi, ko jo prekinem?",
        answer:
          "Naročnino lahko prekinete na strani Nastavitve, v razdelku Naročnina, s klikom na gumb Upravljaj naročnino. Odprl se bo Stripe portal, kjer lahko prekinete naročnino. Po prekinitvi ohranite dostop do vseh vsebin do konca tekočega obračunskega obdobja, nato pa se dostop onemogoči.",
      },
      {
        question: "Kako preverim svojo naročnino?",
        answer:
          "Vse podatke o vaši trenutni naročnini, vključno z veljavnostjo in vrsto paketa, najdete na strani Nastavitve v razdelku Naročnina.",
      },
      {
        question: "Kje najdem račun za svojo naročnino?",
        answer:
          "Račune najdete v portalu za upravljanje naročnine, do katerega dostopate na strani Nastavitve > Naročnina > Upravljaj naročnino. Tam so na voljo vsi pretekli računi.",
      },
    ],
  },
  {
    title: "2. Plačila",
    items: [
      {
        question: "Katere vrste plačil podpirate?",
        answer:
          "Plačila obdelujemo prek platforme Stripe, ki omogoča plačilo s kreditnimi in debetnimi karticami Visa, Mastercard, American Express ter drugimi podprtimi karticami.",
      },
      {
        question: "Ali je plačilo varno?",
        answer:
          "Da. Vsa plačila se izvajajo prek Stripe, ki je certificiran po varnostnem standardu PCI DSS Level 1 — najvišji ravni varnosti za obdelavo kartičnih plačil. Vaših podatkov o kartici nikoli ne vidimo in jih ne shranjujemo, saj gredo neposredno na Stripe.",
      },
      {
        question: "Ali lahko zamenjam plačilno metodo?",
        answer:
          "Da. Plačilno metodo lahko kadarkoli spremenite v portalu za upravljanje naročnine, do katerega dostopate na strani Nastavitve > Naročnina > Upravljaj naročnino.",
      },
    ],
  },
  {
    title: "3. Težave z dostopom",
    items: [
      {
        question: "Pozabil/a sem geslo. Kako ga ponastavim?",
        answer:
          "Na prijavni strani kliknite »Pozabljeno geslo« in vnesite svoj e-poštni naslov. Prejeli boste povezavo za ponastavitev gesla.",
      },
      {
        question: "Ne prejemam e-poštnih sporočil za ponastavitev gesla.",
        answer:
          "Preverite mapo z neželeno pošto (spam). Prepričajte se, da uporabljate e-poštni naslov, s katerim ste se registrirali. Če težava vztraja, nas kontaktirajte na info@tomitalk.si.",
      },
      {
        question: "Aplikacija se ne naloži ali prikazuje napako.",
        answer:
          "Poskusite osvežiti stran, počistiti predpomnilnik brskalnika ali uporabiti drug brskalnik. Če težava vztraja, nas kontaktirajte na info@tomitalk.si.",
      },
    ],
  },
];

const PomocInPodpora = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
        <BreadcrumbNavigation />

        <h1 className="text-3xl font-bold text-dragon-green mb-8">
          Pomoč in podpora
        </h1>

        <div className="prose prose-slate max-w-none space-y-8 text-justify">
          {helpSections.map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {section.title}
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {section.items.map((item, idx) => (
                  <AccordionItem
                    key={idx}
                    value={`${section.title}-${idx}`}
                    className="border-border"
                  >
                    <AccordionTrigger className="text-left text-muted-foreground hover:text-foreground hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}

          {/* 4. Tehnična pomoč */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              4. Tehnična pomoč
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Če niste našli odgovora na vaše vprašanje na tej strani ali med{" "}
              <Link
                to="/clanki/pogosta-vprasanja"
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                pogostimi vprašanji
              </Link>
              , nas kontaktirajte na{" "}
              <a
                href="mailto:info@tomitalk.si"
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                info@tomitalk.si
              </a>{" "}
              in z veseljem vam bomo pomagali.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PomocInPodpora;
