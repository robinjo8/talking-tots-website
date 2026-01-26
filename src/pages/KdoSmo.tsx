import { FooterSection } from "@/components/home/FooterSection";
import Header from "@/components/Header";
import { User } from "lucide-react";

interface TeamMember {
  name: string;
  description: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Špela Kastelic",
    description: "Špela Kastelic je logopedinja, ki se z govorno-jezikovnimi motnjami ukvarja že več kot deset let. Zaposlena je na osnovni šoli s prilagojenim in posebnim programom. V sklopu dodatne strokovne pomoči izvaja logopedske obravnave tudi z otroki z govorno-jezikovnimi motnjami, ki so vključeni v program redne osnovne šole. Deluje tudi kot članica komisij za usmerjanje otrok s posebnimi potrebami.\n\nSvoj prosti čas najraje preživi s svojo družino. Njeni hobiji so različne športne dejavnosti in videoprodukcija."
  },
  {
    name: "Ema Erzar Vidmar",
    description: "Ema Erzar Vidmar je logopedinja z več kot desetletnimi izkušnjami dela v šolskem okolju, kjer strokovno in predano podpira otroke pri razvoju govorno-jezikovnih sposobnosti. Pri svojem delu uporablja sodobne pristope ter z veliko mero ustvarjalnosti razvija lastne didaktične materiale, ki so prilagojeni individualnim potrebam učencev.\n\nV prostem času najraje preživlja kakovosten čas z družino ter uživa v izletih in raziskovanju narave."
  },
  {
    name: "Jasna Kastigar Kujavec",
    description: "Jasna je magistra varstvoslovja, usmerjena v področje informacijske in kibernetske varnosti. Svoje znanje nenehno razvija in nadgrajuje, saj verjame, da je varna, premišljena in odgovorna uporaba tehnologije ključna – še posebej pri rešitvah, namenjenih otrokom.\n\nUsposobljena je za notranje presoje sistemov upravljanja, predvsem na področju informacijske varnosti in kakovosti, za kar ima ustrezne certifikate in kompetence.\n\nV projektu TomiTalk skrbi za varnostni in zakonodajni vidik razvoja, z jasnim ciljem, da je platforma varna, zanesljiva in skladna z veljavnimi predpisi.\n\nNajpomembnejši vlogi v njenem življenju sta mami in žena. V prostem času rada bere knjige o vzgoji, razmišljanju otrok in osebnostni rasti, ob tem pa se izraža tudi skozi pisanje pesmi in petje."
  },
  {
    name: "Robert Kujavec",
    description: "Robert Kujavec je diplomirani varstvoslovec informacijske varnosti, ki se poklicno ukvarja z razvojem, vzdrževanjem ter zagotavljanjem varnosti informacijskih sistemov. Od pojava umetne inteligence temu področju namenja posebno pozornost ter veliko časa posveča njenemu razumevanju in praktični uporabi. Ideja za ustanovitev TomiTalk je nastala kot rezultat spleta okoliščin sodobnega časa, osebnih izkušenj ter zaznanega problema na področju dostopnosti do odprave govorno-jezikovnih težav pri otrocih.\n\nPrizadeva si, da se čim večjemu številu otrok omogoči hiter, učinkovit in dostopen pristop k podpori pri odpravi govorno-jezikovnih težav. Za TomiTalk pravi, da ni le tehnološki projekt, temveč osebna zgodba, utemeljena na odgovornosti, strokovnosti in iskreni želji ustvarjati pozitivne spremembe za širšo družbo.\n\nProsti čas najraje preživlja z družino, ob spremljanju športnih dogodkov ter v družbi prijateljev."
  }
];

const KdoSmo = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
        <h1 className="text-3xl font-bold text-dragon-green mb-8">
          Kdo smo
        </h1>
        
        <div className="prose prose-slate max-w-none space-y-12">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Krožni prostor za sliko */}
              <div className="w-40 h-40 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <User className="w-20 h-20" />
                </div>
              </div>
              
              {/* Ime in opis */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {member.name}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-justify whitespace-pre-line">
                  {member.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default KdoSmo;
