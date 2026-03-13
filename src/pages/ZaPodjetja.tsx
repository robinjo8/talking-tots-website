import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const ZaPodjetja = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
        <h1 className="text-3xl font-bold text-dragon-green mb-8">Za organizacije</h1>

        <div className="prose prose-slate max-w-none space-y-8 text-justify">

          {/* Uvod */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Digitalna podpora za logopede, vrtce, šole in zdravstvene ustanove
            </h2>
            <p className="text-muted-foreground leading-relaxed mt-4">
              TomiTalk je sodobna digitalna platforma za podporo pri razvoju govora otrok, ki združuje logopedske vaje, interaktivne igre, preverjanje izgovorjave in spremljanje napredka.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Platforma je zasnovana za logopede v:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>ambulantah in zasebnih logopedskih praksah</li>
              <li>vrtcih</li>
              <li>osnovnih šolah</li>
              <li>drugih organizacijah, ki delajo z otroki z govornimo-jezikovnimi težavami</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              TomiTalk omogoča, da lahko logopedi in strokovni delavci del procesa logopedske obravnave digitalizirajo, poenostavijo in naredijo bolj preglednega, hkrati pa otrokom ponudi motivacijsko okolje za vadbo govora.
            </p>
          </section>

          {/* Zakaj organizacije izberejo TomiTalk */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Zakaj organizacije izberejo TomiTalk
            </h2>
            <ul className="list-none text-muted-foreground space-y-3 mt-4">
              <li><strong>✔ digitalizacija logopedskih vaj in testov</strong></li>
              <li><strong>✔ pregledno spremljanje napredka otrok</strong></li>
              <li><strong>✔ motivacija otrok skozi igro</strong></li>
              <li><strong>✔ lažje sodelovanje s starši</strong></li>
              <li><strong>✔ enoten sistem za logopede v organizaciji</strong></li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              TomiTalk pomaga organizacijam ustvariti sodoben in pregleden sistem za podporo pri razvoju govora otrok.
            </p>
          </section>

          {/* Izzivi pri logopedski obravnavi otrok */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Izzivi pri logopedski obravnavi otrok
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Veliko ustanov se danes srečuje z izzivi, kot so:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>veliko število otrok z govornimi težavami</li>
              <li>omejen čas za individualno obravnavo</li>
              <li>dolge čakalne dobe za logopedsko pomoč</li>
              <li>zahtevno spremljanje napredka otrok skozi čas</li>
              <li>priprava vaj za vsakega otroka posebej</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              TomiTalk pomaga ustanovam, da del teh procesov poenostavijo in digitalizirajo, kar omogoča boljši pregled nad obravnavo in napredkom otrok.
            </p>
          </section>

          {/* Kaj ponuja TomiTalk */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Kaj ponuja TomiTalk
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              TomiTalk organizacijam ponuja celovit digitalni sistem za podporo pri logopedski obravnavi otrok.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Platforma vključuje:
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Organizacijsko licenco</h4>
            <p className="text-muted-foreground leading-relaxed">
              Organizacija lahko uporablja skupno licenco, ki omogoča dostop več logopedom ali strokovnim delavcem znotraj iste ustanove.
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Upravljanje otrok</h4>
            <p className="text-muted-foreground leading-relaxed">
              Logopedi lahko:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>dodajajo nove otroke</li>
              <li>spremljajo napredek posameznega otroka</li>
              <li>ustvarjajo delovni prostor za vsakega otroka posebej</li>
            </ul>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Preverjanje izgovorjave</h4>
            <p className="text-muted-foreground leading-relaxed">
              TomiTalk vključuje digitalno preverjanje izgovorjave, ki omogoča preverjanje izgovorjave glasov slovenskega jezika.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Na voljo sta:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>standardni test z 60 besedami</li>
              <li>krajši test z 20 besedami, primeren za mlajše otroke</li>
            </ul>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Logopedska poročila</h4>
            <p className="text-muted-foreground leading-relaxed">
              Na podlagi preverjanja izgovorjave je mogoče pripraviti logopedsko poročilo, ki ga lahko logoped posreduje staršem.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Poročila je mogoče tudi izvoziti v PDF obliki.
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Moj osebni načrt</h4>
            <p className="text-muted-foreground leading-relaxed">
              Za vsakega otroka je mogoče pripraviti individualni program vaj in iger, ki je prilagojen njegovim težavam pri izgovorjavi posameznih glasov.
            </p>
          </section>

          {/* Kako TomiTalk pomaga logopedu */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Kako TomiTalk pomaga logopedu
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              TomiTalk logopedu omogoča, da ima vse pomembne informacije o otroku zbrane na enem mestu.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Logoped lahko:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>izvede digitalno preverjanje izgovorjave</li>
              <li>posluša posnetke izgovorjave otrok</li>
              <li>spremlja napredek pri posameznih glasovih</li>
              <li>pripravi priporočila za nadaljnjo vadbo</li>
              <li>staršem posreduje smernice za domačo vadbo</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Na ta način lahko logoped hitreje pripravi ustrezne vaje in lažje spremlja razvoj govora skozi čas.
            </p>
          </section>

          {/* Organizacijski model */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Organizacijski model
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              TomiTalk omogoča organizacijski način uporabe, ki je prilagojen ustanovam.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Sistem deluje na naslednji način:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>administrator potrdi članstvo logopeda v organizaciji</li>
              <li>vsi člani organizacije imajo dostop do skupnega seznama otrok</li>
              <li>pravice urejanja ali brisanja ima logoped, ki je otroka dodal</li>
              <li>organizacija ima določeno skupno kvoto mest za otroke (npr. 50 ali 100 otrok)</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Pomembno je poudariti, da otrok v organizacijskem modelu uporablja TomiTalk v okviru dela z logopedom ali strokovnim delavcem v ustanovi.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Če želi otrok vaditi tudi doma skupaj s starši, mora starš ustvariti svoj uporabniški račun in imeti lastno naročnino za družine.
            </p>
          </section>

          {/* Prednosti za ustanove */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Prednosti za ustanove
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Uporaba TomiTalka prinaša številne prednosti za organizacije.
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Prihranek časa</h4>
            <p className="text-muted-foreground leading-relaxed">
              Vaje, igre in preverjanje izgovorjave so že pripravljeni, zato logopedu ni potrebno vsakič znova pripravljati materialov.
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Motivacija otrok</h4>
            <p className="text-muted-foreground leading-relaxed">
              Otroci vadijo govor skozi igro, kar povečuje njihovo motivacijo za redno vadbo.
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Digitalna dokumentacija</h4>
            <p className="text-muted-foreground leading-relaxed">
              Napredek otrok je zabeležen v digitalni obliki, kar omogoča lažje spremljanje razvoja govora skozi čas.
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Boljše sodelovanje s starši</h4>
            <p className="text-muted-foreground leading-relaxed">
              Logoped lahko staršem posreduje priporočila za domačo vadbo.
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Enoten pregled nad napredkom otrok</h4>
            <p className="text-muted-foreground leading-relaxed">
              Logopedi imajo pregled nad vsemi otroki znotraj organizacije.
            </p>
          </section>

          {/* Primer uporabe */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Primer uporabe
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Logoped v vrtcu ali šoli lahko s TomiTalkom:
            </p>
            <ul className="list-none text-muted-foreground space-y-2 mt-4">
              <li><strong>1️⃣</strong> ustvari profil otroka</li>
              <li><strong>2️⃣</strong> izvede preverjanje izgovorjave</li>
              <li><strong>3️⃣</strong> pripravi osebni načrt vaj</li>
              <li><strong>4️⃣</strong> spremlja napredek otroka skozi čas</li>
              <li><strong>5️⃣</strong> staršem posreduje smernice za domačo vadbo</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Otrok lahko vadi govor v okviru dela z logopedom ali strokovnim delavcem, medtem ko lahko starši doma nadaljujejo z vajami prek svojega uporabniškega računa.
            </p>
          </section>

          {/* Varnost in varstvo podatkov */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Varnost in varstvo podatkov
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              TomiTalk je zasnovan z visokimi standardi varnosti in varstva podatkov.
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>podatki so shranjeni v varnem sistemu</li>
              <li>dostop je zaščiten z uporabniškimi računi</li>
              <li>organizacije imajo nadzor nad svojimi uporabniki</li>
              <li>obdelava podatkov poteka skladno z GDPR uredbo</li>
            </ul>
          </section>

          {/* Organizacijski licenčni model */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Organizacijski licenčni model
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Organizacije lahko izberejo paket glede na svoje potrebe.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Licenca omogoča:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>več logopedov znotraj iste organizacije</li>
              <li>skupni seznam otrok</li>
              <li>upravljanje pravic uporabnikov</li>
              <li>določeno število mest za otroke (npr. 50, 100 ali več)</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Po potrebi je mogoče licenco tudi prilagoditi ali razširiti.
            </p>
          </section>

          {/* Predstavitev TomiTalka */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Predstavitev TomiTalka
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Če vas zanima uporaba TomiTalka v vaši ustanovi, vam lahko pripravimo kratko predstavitev sistema.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Na predstavitvi pokažemo:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>kako deluje preverjanje izgovorjave</li>
              <li>kako logoped upravlja otroke</li>
              <li>kako nastane osebni načrt vaj</li>
              <li>kako starši spremljajo napredek</li>
            </ul>
          </section>

          {/* CTA */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Želite uporabljati TomiTalk v vaši organizaciji?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Kontaktirajte nas za:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>predstavitev sistema</li>
              <li>testni dostop</li>
              <li>pripravo prilagojene ponudbe</li>
            </ul>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button
                onClick={() => navigate("/kontakt")}
                className="bg-dragon-green hover:bg-dragon-green/90 text-white px-8 py-3 text-base"
              >
                Kontaktirajte nas
              </Button>
              <Button
                onClick={() => navigate("/kontakt")}
                variant="outline"
                className="border-dragon-green text-dragon-green hover:bg-dragon-green/10 px-8 py-3 text-base"
              >
                Zahtevajte predstavitev
              </Button>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default ZaPodjetja;
