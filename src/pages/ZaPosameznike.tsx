import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const ZaPosameznike = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
        <h1 className="text-3xl font-bold text-dragon-green mb-8">Za družine</h1>

        <div className="prose prose-slate max-w-none space-y-8 text-justify">

          {/* Uvod */}
          <section>
            <p className="text-lg text-foreground font-medium leading-relaxed">
              Pomagajte svojemu otroku razviti jasen in samozavesten govor
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              TomiTalk je digitalna platforma, ki otrokom pomaga razvijati govor na zabaven, igriv in strokovno podprt način.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Združuje logopedske vaje, interaktivne igre, video navodila, umetno inteligenco ter sistem nagrajevanja, ki dodatno motivira otroke. Z zbiranjem zvezdic, zmajčkov in pokalov otrok dobiva občutek napredka in dosežkov, zato vadba postane podobna igri. Na ta način otrok skozi igro in motivacijo skoraj neopazno, podzavestno vadi govor in izgovorjavo.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              TomiTalk je dostopen kjerkoli in kadarkoli – otrok lahko vadi doma, na poti ali kjerkoli, kjer imate telefon, tablico ali računalnik.
            </p>
          </section>

          {/* 1. Zakaj starši izberejo TomiTalk */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Zakaj starši izberejo TomiTalk
            </h2>
            <ul className="list-none text-muted-foreground space-y-3 mt-4">
              <li>
                <strong>✔ Brez čakalnih dob</strong><br />
                Otrok lahko začne vaditi takoj.
              </li>
              <li>
                <strong>✔ Dostop kjerkoli in kadarkoli</strong><br />
                Telefon, tablica ali računalnik.
              </li>
              <li>
                <strong>✔ Učenje skozi igro</strong><br />
                Otroci vadijo govor skozi zabavne igre.
              </li>
              <li>
                <strong>✔ Razvito v sodelovanju z logopedi</strong><br />
                Vaje temeljijo na logopedskih smernicah.
              </li>
              <li>
                <strong>✔ Spremljanje napredka</strong><br />
                Starši imajo pregled nad napredkom otroka.
              </li>
              <li>
                <strong>✔ Prilagojen program vaj</strong><br />
                Vsak otrok lahko dobi svoj osebni načrt.
              </li>
            </ul>
          </section>

          {/* 2. Ali ima vaš otrok težave z izgovorjavo? */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Ali ima vaš otrok težave z izgovorjavo?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Mnogi starši opazijo, da otrok:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>ne izgovarja pravilno določenih glasov</li>
              <li>zamenjuje glasove (npr. R → L)</li>
              <li>težje izgovarja daljše besede</li>
              <li>govori manj razumljivo kot vrstniki</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Razvoj govora je pomemben za samozavest otroka, komunikacijo in kasnejši uspeh v šoli.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Če otrok potrebuje več vaje, lahko z redno vadbo doma naredi velik napredek.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Raziskave kažejo, da pomoč logopeda potrebuje približno 20–40 % otrok, zato ima z govorom težave velik delež otrok.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              TomiTalk staršem omogoča, da lahko otroku pomagajo pri razvoju govora na preprost in zabaven način.
            </p>
          </section>

          {/* 3. Za koga je TomiTalk */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Za koga je TomiTalk
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              TomiTalk je namenjen otrokom od 3 do 10 let, ki:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>imajo težave z izgovorjavo posameznih glasov</li>
              <li>čakajo na logopedsko obravnavo</li>
              <li>že obiskujejo logopeda in potrebujejo dodatno vadbo doma</li>
              <li>želijo preventivno razvijati govor in jezik</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Aplikacijo lahko uporabljajo tudi otroci starejši od 10 let, vendar je zahtevnost iger in vaj prilagojena predvsem starostni skupini približno 9–10 let.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              TomiTalk je zasnovan kot dopolnilo logopedski obravnavi ali kot podpora pri vadbi doma.
            </p>
          </section>

          {/* 4. Kako TomiTalk pomaga vašemu otroku */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Kako TomiTalk pomaga vašemu otroku
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              TomiTalk uporablja kombinacijo igre, motivacije in strokovnih vaj, da otrok vadi govor na način, ki je zanj zabaven.
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Interaktivne govorne igre</h4>
            <p className="text-muted-foreground leading-relaxed">
              V aplikaciji je več interaktivnih iger, ki razvijajo govor, besedišče, slušno pozornost in izgovorjavo. Otrok se uči skozi igro, kar povečuje motivacijo za vadbo.
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Vaje za motoriko govoril</h4>
            <p className="text-muted-foreground leading-relaxed">
              Posebne vaje pomagajo razvijati pravilno delovanje govoril, saj otrok z njimi trenira gibanje ustnic, jezika, čeljusti in pravilno dihanje, kar je ključna osnova za pravilno izgovorjavo posameznih glasov.
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Video navodila logopeda</h4>
            <p className="text-muted-foreground leading-relaxed">
              Logoped v kratkih videih pokaže, kako pravilno izvajati vaje in kako pravilno izgovoriti posamezne glasove.
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Sistem nagrajevanja</h4>
            <p className="text-muted-foreground leading-relaxed">
              Otroci zbirajo nagrade, kot so zvezdice, zmajčki in pokali, kar jih dodatno motivira za redno vadbo in občutek napredka.
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Spremljanje napredka</h4>
            <p className="text-muted-foreground leading-relaxed">
              Starši lahko v svojem profilu spremljajo:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>katere vaje in igre je otrok opravil</li>
              <li>kako pogosto vadi</li>
              <li>kako napreduje pri posameznih glasovih</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Tako dobijo jasen pregled nad napredkom otroka.
            </p>
          </section>

          {/* 5. TomiTalk na kratko */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              TomiTalk na kratko
            </h2>
            <ul className="list-none text-muted-foreground space-y-3 mt-4">
              <li>
                <strong>🎮 10+ govornih iger</strong><br />
                za razvoj govora in besedišča
              </li>
              <li>
                <strong>🧠 60 besed v preverjanju izgovorjave</strong><br />
                za analizo glasov slovenskega jezika
              </li>
              <li>
                <strong>👩‍⚕️ Strokovna analiza logopedov</strong><br />
                za pripravo smernic za vadbo
              </li>
              <li>
                <strong>📈 Dnevni napredek</strong><br />
                otroci vsak dan opravijo nove vaje
              </li>
            </ul>
          </section>

          {/* 6. Samo 30 minut na dan */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Samo 30 minut na dan
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Za napredek pri govoru niso potrebne dolge vaje.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Že približno 30 minut na dan je dovolj, da otrok opravi svoj Tvoj dnevni napredek, ki vključuje približno 10 iger ali vaj.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Redna kratka vadba pogosto prinese najboljše rezultate.
            </p>
          </section>

          {/* 7. Kako deluje TomiTalk */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Kako deluje TomiTalk
            </h2>
            <ul className="list-none text-muted-foreground space-y-2 mt-4">
              <li><strong>1️⃣</strong> Otrok opravi Preverjanje izgovorjave</li>
              <li><strong>2️⃣</strong> Logopedi analizirajo izgovorjavo in pripravijo logopedsko poročilo</li>
              <li><strong>3️⃣</strong> Sistem ustvari Moj osebni načrt vaj</li>
              <li><strong>4️⃣</strong> Otrok redno vadi skozi igre in naloge</li>
            </ul>
          </section>

          {/* 8. Preverjanje izgovorjave */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Preverjanje izgovorjave
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Pred začetkom vadbe TomiTalk ponuja Preverjanje izgovorjave, ki deluje podobno kot diagnostični pregled pri logopedu.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Otrok izgovori izbrane besede, njegovo izgovorjavo pa poslušajo logopedi, ki nato strokovno ocenijo posamezne glasove. Na podlagi poslušanja posnetkov logopedi pripravijo strokovno oceno izgovorjave ter podajo smernice za nadaljnjo vadbo, ki so prilagojene vsakemu otroku posebej.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Rezultat preverjanja je logopedsko poročilo, ki ga starš prejme v svoj uporabniški profil.
            </p>
          </section>

          {/* 9. Moj osebni načrt */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Moj osebni načrt
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Na podlagi Preverjanja izgovorjave in logopedskega poročila se za vsakega otroka generira Moj osebni načrt.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Gre za prilagojen program vaj in iger, ki je sestavljen glede na otrokove težave pri izgovorjavi posameznih glasov. Sistem tako predlaga točno tiste aktivnosti, ki otroku najbolj pomagajo pri izboljšanju govora.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Načrt vključuje kombinacijo:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>govornih vaj</li>
              <li>logopedskih vaj za motoriko govoril</li>
              <li>interaktivnih iger</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Vsak otrok ima svoj individualni program, ki se lahko skozi čas prilagaja glede na napredek.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Funkcija Moj osebni načrt je vključena v paket TomiTalk Pro.
            </p>
          </section>

          {/* 10. Kako začeti */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Kako začeti
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Za začetek potrebujete le nekaj minut.
            </p>
            <ul className="list-none text-muted-foreground space-y-2 mt-4">
              <li><strong>1️⃣</strong> Ustvarite uporabniški račun</li>
              <li><strong>2️⃣</strong> Dodajte profil otroka</li>
              <li><strong>3️⃣</strong> Otrok lahko začne z vajami in igrami</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Otrok lahko začne vaditi takoj po registraciji, brez čakalnih dob ali naročanja na termine.
            </p>
          </section>

          {/* 11. Pogosta vprašanja */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Pogosta vprašanja
            </h2>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Ali TomiTalk nadomešča logopeda?</h4>
            <p className="text-muted-foreground leading-relaxed">
              Ne. TomiTalk je dopolnilo logopedski obravnavi ali pomoč pri vadbi doma.
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Koliko časa naj otrok vadi?</h4>
            <p className="text-muted-foreground leading-relaxed">
              Priporočamo približno 30 minut vadbe na dan, kar je povprečno dovolj, da otrok opravi svoj Tvoj dnevni napredek, ki običajno vključuje približno 10 iger ali vaj na dan.
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Na katerih napravah deluje TomiTalk?</h4>
            <p className="text-muted-foreground leading-relaxed">
              TomiTalk deluje na:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>telefonu</li>
              <li>tablici</li>
              <li>računalniku</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Aplikacija je optimizirana za vse naprave.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Več pogostih vprašanj si lahko preberete na strani{" "}
              <span
                className="text-dragon-green cursor-pointer hover:underline"
                onClick={() => navigate("/clanki/pogosta-vprasanja")}
              >
                Pogosta vprašanja
              </span>.
            </p>
          </section>

          {/* 12. Začnite z vadbo že danes */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Začnite z vadbo že danes
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Redna vadba je ključ do napredka pri razvoju govora.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              S TomiTalk lahko vaš otrok začne vaditi že danes – na zabaven, igriv in strokovno podprt način.
            </p>
            <ul className="list-none text-muted-foreground space-y-2 mt-4">
              <li>✔ brez čakalnih dob</li>
              <li>✔ dostop kjerkoli in kadarkoli</li>
              <li>✔ zabavne govorne igre</li>
              <li>✔ prilagojen program vaj</li>
            </ul>
            <div className="mt-6">
              <Button
                onClick={() => navigate("/register")}
                className="bg-dragon-green hover:bg-dragon-green/90 text-white px-8 py-3 text-base"
              >
                👉 Ustvarite račun in začnite z vadbo
              </Button>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default ZaPosameznike;
