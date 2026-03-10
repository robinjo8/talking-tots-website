import Header from "@/components/Header";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { Link } from "react-router-dom";
import { CreditCard, Wallet, KeyRound, Headphones } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const helpSections = [
  {
    title: "Naročnina",
    icon: CreditCard,
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
    title: "Plačila",
    icon: Wallet,
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
    title: "Težave z dostopom",
    icon: KeyRound,
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
      <div className="pt-20">
        <BreadcrumbNavigation />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Pomoč in podpora</h1>
        <p className="text-muted-foreground mb-10">
          Poiščite odgovore na pogosta vprašanja o naročnini, plačilih in uporabi aplikacije.
        </p>

        <div className="space-y-10">
          {helpSections.map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.title}>
                <div className="flex items-center gap-2.5 mb-4">
                  <Icon className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
                </div>
                <div className="bg-card rounded-xl border border-border shadow-sm">
                  <Accordion type="single" collapsible className="w-full">
                    {section.items.map((item, idx) => (
                      <AccordionItem
                        key={idx}
                        value={`${section.title}-${idx}`}
                        className={idx === section.items.length - 1 ? "border-b-0" : ""}
                      >
                        <AccordionTrigger className="px-5 text-left text-foreground hover:no-underline">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="px-5 text-muted-foreground leading-relaxed">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </div>
            );
          })}

          {/* Tehnična pomoč */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <Headphones className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Tehnična pomoč</h2>
            </div>
            <div className="bg-card rounded-xl border border-border shadow-sm p-6">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomocInPodpora;
