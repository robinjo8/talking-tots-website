import { useState } from "react";
import { User, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TeamMember {
  name: string;
  shortDescription: string;
  fullDescription: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Špela Kastelic",
    shortDescription: "je logopedinja z več kot desetletnimi izkušnjami, ki dela z otroki z govorno-jezikovnimi motnjami in je članica komisije za usmerjanje otrok s posebnimi potrebami.",
    fullDescription: "Špela Kastelic je logopedinja, ki se z govorno-jezikovnimi motnjami ukvarja že več kot deset let. Zaposlena je na osnovni šoli s prilagojenim in posebnim programom. V sklopu dodatne strokovne pomoči izvaja logopedske obravnave tudi z otroki z govorno-jezikovnimi motnjami, ki so vključeni v program redne osnovne šole. Deluje tudi kot članica komisij za usmerjanje otrok s posebnimi potrebami.\n\nSvoj prosti čas najraje preživi s svojo družino. Njeni hobiji so različne športne dejavnosti in videoprodukcija."
  },
  {
    name: "Ema Erzar Vidmar",
    shortDescription: "Ema Erzar Vidmar je logopedinja z več kot desetletnimi izkušnjami v šolskem okolju, kjer s sodobnimi pristopi in lastnimi didaktičnimi materiali podpira razvoj govorno-jezikovnih sposobnosti otrok.",
    fullDescription: "Ema Erzar Vidmar je logopedinja z več kot desetletnimi izkušnjami dela v šolskem okolju, kjer strokovno in predano podpira otroke pri razvoju govorno-jezikovnih sposobnosti. Pri svojem delu uporablja sodobne pristope ter z veliko mero ustvarjalnosti razvija lastne didaktične materiale, ki so prilagojeni individualnim potrebam učencev.\n\nV prostem času najraje preživlja kakovosten čas z družino ter uživa v izletih in raziskovanju narave."
  },
  {
    name: "Jasna Kastigar Kujavec",
    shortDescription: "Jasna je magistra varstvoslovja, specializirana za informacijsko in kibernetsko varnost, ki v projektu TomiTalk skrbi za varnostni in zakonodajni vidik razvoja ter skladnost z veljavnimi predpisi.",
    fullDescription: "Jasna je magistra varstvoslovja, usmerjena v področje informacijske in kibernetske varnosti. Svoje znanje nenehno razvija in nadgrajuje, saj verjame, da je varna, premišljena in odgovorna uporaba tehnologije ključna – še posebej pri rešitvah, namenjenih otrokom.\n\nUsposobljena je za notranje presoje sistemov upravljanja, predvsem na področju informacijske varnosti in kakovosti, za kar ima ustrezne certifikate in kompetence.\n\nV projektu TomiTalk skrbi za varnostni in zakonodajni vidik razvoja, z jasnim ciljem, da je platforma varna, zanesljiva in skladna z veljavnimi predpisi.\n\nNajpomembnejši vlogi v njenem življenju sta mami in žena. V prostem času rada bere knjige o vzgoji, razmišljanju otrok in osebnostni rasti, ob tem pa se izraža tudi skozi pisanje pesmi in petje."
  },
  {
    name: "Robert Kujavec",
    shortDescription: "Robert Kujavec je pobudnik projekta TomiTalk z jasno vizijo omogočiti otrokom hiter in učinkovit dostop do podpore pri govorno-jezikovnih težavah.",
    fullDescription: "Robert Kujavec je diplomirani varstvoslovec informacijske varnosti, ki se poklicno ukvarja z razvojem, vzdrževanjem ter zagotavljanjem varnosti informacijskih sistemov. Od pojava umetne inteligence temu področju namenja posebno pozornost ter veliko časa posveča njenemu razumevanju in praktični uporabi. Ideja za ustanovitev TomiTalk je nastala kot rezultat spleta okoliščin sodobnega časa, osebnih izkušenj ter zaznanega problema na področju dostopnosti do odprave govorno-jezikovnih težav pri otrocih.\n\nPrizadeva si, da se čim večjemu številu otrok omogoči hiter, učinkovit in dostopen pristop k podpori pri odpravi govorno-jezikovnih težav. Za TomiTalk pravi, da ni le tehnološki projekt, temveč osebna zgodba, utemeljena na odgovornosti, strokovnosti in iskreni želji ustvarjati pozitivne spremembe za širšo družbo.\n\nProsti čas najraje preživlja z družino, ob spremljanju športnih dogodkov ter v družbi prijateljev."
  }
];

export function TeamSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="py-16 md:py-24 px-4 md:px-10 bg-background">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
          Kdo smo
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex flex-col items-center text-center gap-4">
              <div className="w-28 h-28 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <User className="w-14 h-14 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {member.name}
                </h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {expanded ? member.fullDescription : member.shortDescription}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Button
            variant="outline"
            onClick={() => setExpanded(!expanded)}
            className="gap-2"
          >
            {expanded ? (
              <>Prikaži manj <ChevronUp className="w-4 h-4" /></>
            ) : (
              <>Prikaži več <ChevronDown className="w-4 h-4" /></>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
