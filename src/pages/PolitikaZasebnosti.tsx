import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FooterSection } from "@/components/home/FooterSection";
import Header from "@/components/Header";

const PolitikaZasebnosti = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
        <h1 className="text-3xl font-bold text-dragon-green mb-8">Politika zasebnosti</h1>
        
        <div className="prose prose-slate max-w-none space-y-6 text-justify">
          
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. UVOD</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nosilec spletne platforme »TomiTalk« (v nadaljevanju: »Platforma«) je TomiTalk, Robert Kujavec s.p., Dobrnič 13, 8211, Dobrnič, davčna številka: 63740311 (v nadaljevanju: »Upravljavec«).
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Ta politika zasebnosti pojasnjuje, kako zbiramo, uporabljamo, shranjujemo in varujemo vaše osebne podatke pri uporabi Platforme TomiTalk.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Z uporabo Platforme soglašate s pogoji te politike zasebnosti. Če se s to politiko ne strinjate, prosimo, da Platforme ne uporabljate.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. KATERE PODATKE ZBIRAMO</h2>
            <p className="text-muted-foreground leading-relaxed">
              Pri uporabi Platforme TomiTalk lahko zbiramo naslednje kategorije osebnih podatkov:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-3 mt-4">
              <li><strong>Registracijski podatki:</strong> elektronski naslov, uporabniško ime, geslo.</li>
              <li><strong>Podatki o otroku:</strong> ime, starost, spol, podatki o govornem razvoju, ki jih vnesete vi kot starš ali skrbnik.</li>
              <li><strong>Podatki o uporabi:</strong> informacije o vaši uporabi Platforme, vključno z opravljenimi vajami, igrami, testi in napredkom.</li>
              <li><strong>Zvočni posnetki:</strong> posnetki govora otroka, ki se lahko shranjujejo za namene analize izgovorjave.</li>
              <li><strong>Tehnični podatki:</strong> IP naslov, vrsta brskalnika, operacijski sistem, čas dostopa.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. NAMEN OBDELAVE PODATKOV</h2>
            <p className="text-muted-foreground leading-relaxed">
              Vaše osebne podatke obdelujemo za naslednje namene:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-3 mt-4">
              <li>Zagotavljanje dostopa do Platforme in njenih funkcionalnosti.</li>
              <li>Personalizacija vsebin in vaj glede na starost in potrebe otroka.</li>
              <li>Analiza govornega razvoja in priprava poročil.</li>
              <li>Izboljšanje Platforme in uporabniške izkušnje.</li>
              <li>Komunikacija z vami glede vaših poizvedb ali posodobitev storitev.</li>
              <li>Izpolnjevanje zakonskih obveznosti.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. PRAVNA PODLAGA ZA OBDELAVO</h2>
            <p className="text-muted-foreground leading-relaxed">
              Vaše osebne podatke obdelujemo na naslednjih pravnih podlagah:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-3 mt-4">
              <li><strong>Izvajanje pogodbe:</strong> obdelava je potrebna za izvajanje storitev, ki ste jih naročili.</li>
              <li><strong>Privolitev:</strong> za obdelavo zvočnih posnetkov in posebnih kategorij podatkov pridobimo vašo izrecno privolitev.</li>
              <li><strong>Zakoniti interes:</strong> za izboljšanje storitev in zagotavljanje varnosti Platforme.</li>
              <li><strong>Zakonska obveznost:</strong> kadar obdelava izhaja iz veljavne zakonodaje.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. PIŠKOTKI</h2>
            <p className="text-muted-foreground leading-relaxed">
              Platforma TomiTalk uporablja piškotke za zagotavljanje delovanja spletne strani in izboljšanje uporabniške izkušnje.
            </p>
            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Vrste piškotkov:</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-3">
              <li><strong>Nujni piškotki:</strong> potrebni za osnovno delovanje Platforme (prijava, seja).</li>
              <li><strong>Funkcionalni piškotki:</strong> omogočajo zapomnjenje vaših nastavitev in preferenc.</li>
              <li><strong>Analitični piškotki:</strong> pomagajo nam razumeti, kako uporabljate Platformo.</li>
              <li><strong>Marketinški piškotki:</strong> uporabljajo se za prikazovanje prilagojenih vsebin.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Ob prvem obisku Platforme boste pozvani k izbiri, katere piškotke želite sprejeti. Svojo izbiro lahko kadarkoli spremenite.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. OBDOBJE HRAMBE</h2>
            <p className="text-muted-foreground leading-relaxed">
              Vaše osebne podatke hranimo le toliko časa, kolikor je potrebno za izpolnitev namenov, za katere so bili zbrani, ali dokler je to zahtevano z veljavno zakonodajo.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Po prenehanju uporabe Platforme ali po vaši zahtevi za izbris bodo vaši podatki izbrisani v razumnem roku, razen če zakonodaja zahteva daljšo hrambo.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. VARNOST PODATKOV</h2>
            <p className="text-muted-foreground leading-relaxed">
              Uporabljamo ustrezne tehnične in organizacijske ukrepe za zaščito vaših osebnih podatkov pred nepooblaščenim dostopom, izgubo, uničenjem ali razkritjem.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Kljub našim prizadevanjem ne moremo zagotoviti popolne varnosti prenosa podatkov preko interneta. Uporaba Platforme je na lastno odgovornost.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. VAŠE PRAVICE</h2>
            <p className="text-muted-foreground leading-relaxed">
              Kot posameznik imate v zvezi z vašimi osebnimi podatki naslednje pravice:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-3 mt-4">
              <li><strong>Pravica do dostopa:</strong> pravica do informacij o tem, katere vaše podatke obdelujemo.</li>
              <li><strong>Pravica do popravka:</strong> pravica zahtevati popravek netočnih podatkov.</li>
              <li><strong>Pravica do izbrisa:</strong> pravica zahtevati izbris vaših podatkov (»pravica do pozabe«).</li>
              <li><strong>Pravica do omejitve obdelave:</strong> pravica omejiti obdelavo vaših podatkov.</li>
              <li><strong>Pravica do prenosljivosti:</strong> pravica prejeti svoje podatke v strukturirani obliki.</li>
              <li><strong>Pravica do ugovora:</strong> pravica ugovarjati obdelavi vaših podatkov.</li>
              <li><strong>Pravica do preklica privolitve:</strong> privolitev lahko kadar koli prekličete.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Za uveljavljanje svojih pravic nas kontaktirajte na: <a href="mailto:info@tomitalk.si" className="text-dragon-green hover:underline">info@tomitalk.si</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. POSREDOVANJE PODATKOV TRETJIM</h2>
            <p className="text-muted-foreground leading-relaxed">
              Vaših osebnih podatkov ne prodajamo tretjim osebam. Podatke lahko delimo z:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-3 mt-4">
              <li>Ponudniki storitev, ki nam pomagajo pri delovanju Platforme (gostovanje, analitika).</li>
              <li>Pristojnimi organi, kadar je to zahtevano z zakonodajo.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Vsi naši ponudniki storitev so zavezani k varovanju vaših podatkov in jih lahko uporabljajo le za namene, ki smo jih določili.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. SPREMEMBE POLITIKE ZASEBNOSTI</h2>
            <p className="text-muted-foreground leading-relaxed">
              To politiko zasebnosti lahko občasno posodobimo. O bistvenih spremembah vas bomo obvestili preko Platforme ali na drug ustrezen način.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Priporočamo, da občasno preverite to stran za morebitne posodobitve.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. KONTAKT</h2>
            <p className="text-muted-foreground leading-relaxed">
              Za vsa vprašanja v zvezi s to politiko zasebnosti ali obdelavo vaših osebnih podatkov nas lahko kontaktirate:
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong>TomiTalk, Robert Kujavec s.p.</strong><br />
              Dobrnič 13, 8211 Dobrnič<br />
              E-pošta: <a href="mailto:info@tomitalk.si" className="text-dragon-green hover:underline">info@tomitalk.si</a>
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Če menite, da so bile vaše pravice kršene, imate pravico vložiti pritožbo pri Informacijskem pooblaščencu Republike Slovenije.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-6 text-sm italic">
              Zadnja sprememba: 3.1.2026
            </p>
          </section>
        </div>
      </div>
      
      {/* Promotional Section */}
      <section className="py-16 px-4 md:px-10 bg-light-cloud">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left: Logo, Text and Buttons */}
            <div className="space-y-6">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold text-dragon-green">Tomi</span>
                <span className="text-2xl font-extrabold text-app-orange">Talk</span>
              </div>
              
              <div className="space-y-2">
                <p className="text-xl md:text-2xl font-semibold text-foreground">
                  Ne veš, ali otrok pravilno izgovarja glasove?
                </p>
                <p className="text-lg text-muted-foreground">
                  Spoznaj strukturirano govorno podporo za razvoj otrokovega govora:
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-dragon-green font-bold">✔</span>
                  <span className="text-muted-foreground">Vodene govorne vaje, prilagojene otrokovi starosti in težavi</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-dragon-green font-bold">✔</span>
                  <span className="text-muted-foreground">Otrok vadi izgovorjavo ob slikah in jasnih navodilih</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-dragon-green font-bold">✔</span>
                  <span className="text-muted-foreground">Vsebine v slovenskem jeziku, pripravljene po logopedskih smernicah</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-dragon-green font-bold">✔</span>
                  <span className="text-muted-foreground">Dostopna pomoč doma – brez dolgih čakalnih dob</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  onClick={() => navigate("/login")}
                  className="bg-app-orange hover:bg-app-orange/90 text-white font-semibold px-8 py-6 text-base"
                >
                  PREIZKUSI BREZPLAČNO
                </Button>
                <Button
                  onClick={() => navigate("/")}
                  variant="outline"
                  className="border-2 border-foreground text-foreground hover:bg-foreground/5 font-semibold px-8 py-6 text-base"
                >
                  IZVEDI VEČ
                </Button>
              </div>
            </div>
            
            {/* Right: Dragon Image */}
            <div className="relative hidden md:block">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <img
                  src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_0.png"
                  alt="Zmajček maskota"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <FooterSection />
    </div>
  );
};

export default PolitikaZasebnosti;
