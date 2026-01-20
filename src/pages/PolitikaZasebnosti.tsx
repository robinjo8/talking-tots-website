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
        <h1 className="text-3xl font-bold text-dragon-green mb-8">POLITIKA ZASEBNOSTI IN PIŠKOTKOV</h1>
        
        <div className="prose prose-slate max-w-none space-y-6 text-justify">
          
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">UVOD</h2>
            <p className="text-muted-foreground leading-relaxed">
              Namen te Politike zasebnosti in piškotkov je seznanitev uporabnikov (v nadaljevanju tudi: posameznik ali vi) spletnega mesta https://tomitalk.si (»spletno mesto«) z nameni in podlago obdelave osebnih podatkov s strani upravljavca spletnega mesta TomiTalk, Robert Kujavec s.p., Dobrnič 13, 8211 Dobrnič, e-naslov: <a href="mailto:info@tomitalk.si" className="text-dragon-green hover:underline">info@tomitalk.si</a> (v nadaljevanju: upravljavec, mi ali podjetje).
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Vse osebne podatke obdelujemo, hranimo in varujemo v skladu z veljavno zakonodajo, ki ureja varstvo osebnih podatkov, zlasti v skladu z Uredbo (EU) 2016/679 Evropskega parlamenta in Sveta z dne 27. aprila 2016 o varstvu posameznikov pri obdelavi osebnih podatkov in o prostem pretoku takih podatkov ter o razveljavitvi Direktive 95/46/ES (Splošna uredba o varstvu podatkov – GDPR) ter Zakonom o varstvu osebnih podatkov (ZVOP-2).
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Uporabnikom priporočamo, da Politiko zasebnosti in piškotkov natančno preberejo, saj vsebuje pomembne informacije o tem, katere osebne podatke obdelujemo, za kakšne namene, na kakšni pravni podlagi in kakšne pravice imate kot posamezniki.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              S posredovanjem osebnih podatkov izjavljate, da ste seznanjeni s Politiko zasebnosti in piškotkov ter da razumete načine in pravne podlage obdelave osebnih podatkov. Če se z načini obdelave osebnih podatkov ne strinjate, vas prosimo, da nam svojih osebnih podatkov ne posredujete in spletnega mesta ne uporabljate v delu, kjer je posredovanje osebnih podatkov potrebno.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">OSNOVNI POJMI</h2>
            <p className="text-muted-foreground leading-relaxed">
              V nadaljevanju so opisani osnovni pojmi, s katerimi se srečujete ob branju Politike zasebnosti in piškotkov spletnega mesta TomiTalk:
            </p>
            
            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Osebni podatek:</h3>
            <p className="text-muted-foreground leading-relaxed">
              Osebni podatek je katerakoli informacija, ki se nanaša na določenega ali določljivega posameznika. Posameznik je določljiv, kadar ga je mogoče neposredno ali posredno identificirati, zlasti z navedbo identifikatorja, kot so ime in priimek, identifikacijska številka, podatki o lokaciji, spletni identifikator ali z navedbo enega ali več dejavnikov, značilnih za posameznikovo fizično, fiziološko, genetsko, duševno, gospodarsko, kulturno ali družbeno identiteto.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Subjekt podatkov:</h3>
            <p className="text-muted-foreground leading-relaxed">
              Subjekt podatkov je določena ali določljiva fizična oseba, na katero se nanašajo osebni podatki, ki jih obdeluje upravljavec. V okviru platforme TomiTalk so to predvsem starši oziroma zakoniti zastopniki otrok ter otroci, kadar se njihovi podatki obdelujejo v skladu z veljavno zakonodajo.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Obdelava osebnih podatkov:</h3>
            <p className="text-muted-foreground leading-relaxed">
              Obdelava osebnih podatkov pomeni kakršnokoli dejanje ali niz dejanj, ki se izvaja v zvezi z osebnimi podatki, kot so zbiranje, pridobivanje, vpis, urejanje, shranjevanje, prilagajanje ali spreminjanje, vpogled, uporaba, razkritje s prenosom, sporočanje, širjenje ali drugo dajanje na razpolago, razvrščanje ali povezovanje, omejitev, anonimiziranje, izbris ali uničenje osebnih podatkov. Obdelava se lahko izvaja ročno ali z uporabo avtomatiziranih sredstev.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Omejitev obdelave:</h3>
            <p className="text-muted-foreground leading-relaxed">
              Omejitev obdelave pomeni označevanje shranjenih osebnih podatkov z namenom, da se njihova obdelava v prihodnje omeji.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Oblikovanje profilov (profiliranje):</h3>
            <p className="text-muted-foreground leading-relaxed">
              Oblikovanje profilov pomeni vsako obliko avtomatizirane obdelave osebnih podatkov, pri kateri se osebni podatki uporabljajo za ocenjevanje določenih osebnih vidikov posameznika, zlasti za analizo ali napoved vidikov, povezanih z vedenjem, interesi, napredkom, razvojem ali drugimi značilnostmi posameznika.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Avtomatizirano odločanje:</h3>
            <p className="text-muted-foreground leading-relaxed">
              Avtomatizirano odločanje pomeni odločanje, ki temelji izključno na avtomatizirani obdelavi osebnih podatkov, vključno s profiliranjem, in ima pravne učinke za posameznika ali nanj podobno znatno vpliva.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Anonimiziranje:</h3>
            <p className="text-muted-foreground leading-relaxed">
              Anonimiziranje pomeni obdelavo osebnih podatkov na tak način, da podatkov ni več mogoče povezati z določenim ali določljivim posameznikom, niti posredno, pri čemer se dodatne informacije, če obstajajo, hranijo ločeno in so zaščitene z ustreznimi tehničnimi in organizacijskimi ukrepi.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Upravljavec osebnih podatkov:</h3>
            <p className="text-muted-foreground leading-relaxed">
              Upravljavec osebnih podatkov je fizična ali pravna oseba, ki sama ali skupaj z drugimi določa namene in sredstva obdelave osebnih podatkov. Za obdelavo osebnih podatkov na platformi TomiTalk je odgovoren upravljavec, naveden v uvodnem delu te Politike zasebnosti.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Obdelovalec osebnih podatkov:</h3>
            <p className="text-muted-foreground leading-relaxed">
              Obdelovalec osebnih podatkov je fizična ali pravna oseba, javni organ, agencija ali drug organ, ki obdeluje osebne podatke v imenu upravljavca in na podlagi njegovih navodil.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Uporabnik osebnih podatkov:</h3>
            <p className="text-muted-foreground leading-relaxed">
              Uporabnik osebnih podatkov je fizična ali pravna oseba, javni organ, agencija ali drug organ, kateremu so osebni podatki razkriti, ne glede na to, ali gre za tretjo osebo ali ne. Javni organi, ki pridobivajo osebne podatke v okviru zakonskih pooblastil, se ne štejejo za uporabnike osebnih podatkov v smislu te Politike zasebnosti.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Tretja oseba:</h3>
            <p className="text-muted-foreground leading-relaxed">
              Tretja oseba je fizična ali pravna oseba, javni organ, agencija ali drug subjekt, ki ni subjekt podatkov, upravljavec, obdelovalec ali oseba, pooblaščena za obdelavo osebnih podatkov v imenu upravljavca ali obdelovalca.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Privolitev posameznika:</h3>
            <p className="text-muted-foreground leading-relaxed">
              Privolitev posameznika pomeni vsako prostovoljno, izrecno, informirano in nedvoumno izjavo volje posameznika, s katero ta z izjavo ali jasnim pritrdilnim dejanjem soglaša z obdelavo osebnih podatkov, ki se nanašajo nanj. Kadar se obdelujejo osebni podatki otrok, se privolitev daje v skladu z veljavno zakonodajo s strani staršev ali zakonitih zastopnikov.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">UPRAVLJAVEC IN POOBLAŠČENA OSEBA ZA VARSTVO OSEBNIH PODATKOV</h2>
            <p className="text-muted-foreground leading-relaxed">
              Upravljavec osebnih podatkov je:
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong>Robert Kujavec s.p., Dobrnič 13, 8211 Dobrnič, Slovenija, e-naslov: <a href="mailto:info@tomitalk.si" className="text-dragon-green hover:underline">info@tomitalk.si</a>.</strong>
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Upravljavec je odgovoren za zakonito, pregledno in varno obdelavo osebnih podatkov v skladu z veljavno zakonodajo o varstvu osebnih podatkov.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Upravljavec nima imenovane pooblaščene osebe za varstvo osebnih podatkov (DPO), saj glede na naravo, obseg in namen obdelave osebnih podatkov to ni zakonsko obvezno. Za vsa vprašanja v zvezi z obdelavo osebnih podatkov, uveljavljanjem pravic posameznikov ali v primeru nejasnosti se lahko uporabniki obrnejo neposredno na upravljavca preko navedenega kontaktnega e-naslova.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">NAMEN OBDELAVE IN PRAVNE PODLAGE ZA OBDELAVO OSEBNIH PODATKOV</h2>
            <p className="text-muted-foreground leading-relaxed">
              Upravljavec obdeluje osebne podatke uporabnikov skladno z veljavno zakonodajo in izključno za vnaprej določene, zakonite in pregledno opredeljene namene. Osebni podatki se obdelujejo na naslednjih pravnih podlagah:
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">a) Obdelava osebnih podatkov na podlagi privolitve</h3>
            <p className="text-muted-foreground leading-relaxed">
              Upravljavec obdeluje osebne podatke na podlagi prostovoljne, izrecne, informirane in nedvoumne privolitve posameznika za naslednje namene:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>izpolnitev in obravnavo povpraševanj preko kontaktnega obrazca,</li>
              <li>sodelovanje v promocijskih in informativnih aktivnostih, ki so objavljene na spletni strani,</li>
              <li>uporabo elektronskega naslova in/ali telefonske številke za pošiljanje obvestil, informacij in ponudb v zvezi z izdelki in storitvami TomiTalk,</li>
              <li>pošiljanje e-novic in drugih informativnih vsebin,</li>
              <li>zaščito izdelkov, storitev in intelektualne lastnine upravljavca.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Posameznik lahko svojo privolitev kadarkoli prekliče, pri čemer preklic ne vpliva na zakonitost obdelave, ki se je izvajala do preklica.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">b) Obdelava osebnih podatkov na podlagi pogodbe (pogodbena obdelava)</h3>
            <p className="text-muted-foreground leading-relaxed">
              Upravljavec obdeluje osebne podatke tudi kadar je to potrebno za sklenitev ali izvajanje pogodbenega razmerja z uporabnikom, zlasti v naslednjih primerih:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>registracija uporabniškega računa na platformi TomiTalk,</li>
              <li>uporaba spletne in mobilne aplikacije v skladu s Splošnimi pogoji,</li>
              <li>sklenitev naročniškega razmerja in omogočanje dostopa do vsebin, vaj, iger, poročil in drugih funkcionalnosti platforme,</li>
              <li>upravljanje uporabniških računov, spremljanje napredka ter zagotavljanje podpore uporabnikom.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Brez posredovanja določenih osebnih podatkov izvajanje pogodbenih obveznosti ni mogoče.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">c) Obdelava osebnih podatkov na podlagi zakonitega interesa</h3>
            <p className="text-muted-foreground leading-relaxed">
              Upravljavec lahko obdeluje osebne podatke tudi na podlagi zakonitega interesa, kadar tak interes prevlada nad interesi ali temeljnimi pravicami posameznika, in sicer za naslednje namene:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>odgovor na povpraševanja v zvezi z izdelki in storitvami,</li>
              <li>zagotavljanje podpore uporabnikom,</li>
              <li>obveščanje ob začetku ali ne dokončanju postopka naročila,</li>
              <li>neposredno trženje lastnih podobnih izdelkov in storitev, v skladu s točko (f) prvega odstavka 6. člena GDPR in veljavno zakonodajo s področja elektronskih komunikacij,</li>
              <li>izboljševanje delovanja in uporabniške izkušnje spletnega mesta in aplikacije,</li>
              <li>zagotavljanje informacijske varnosti ter stabilnega delovanja IT-sistemov,</li>
              <li>preprečevanje zlorab, nepooblaščenega dostopa in morebitnih goljufij.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Posameznik ima pravico do ugovora zoper obdelavo osebnih podatkov na podlagi zakonitega interesa.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">d) Obdelava osebnih podatkov na podlagi zakona</h3>
            <p className="text-muted-foreground leading-relaxed">
              Upravljavec obdeluje osebne podatke tudi kadar je to potrebno za izpolnitev zakonskih obveznosti, ki veljajo za upravljavca, zlasti:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>v povezavi z izpolnjevanjem davčnih, računovodskih in drugih zakonskih obveznosti,</li>
              <li>v primerih, ko obdelavo osebnih podatkov zahteva veljavna zakonodaja ali pristojni organi.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">PODATKI, KI JIH ZBIRAMO</h2>
            <p className="text-muted-foreground leading-relaxed">
              Upravljavec zbira in obdeluje osebne podatke v obsegu, ki je potreben za delovanje platforme TomiTalk, zagotavljanje storitev ter izpolnjevanje pogodbenih in zakonskih obveznosti. Zbiramo naslednje vrste podatkov:
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">1) Prostovoljno posredovani podatki</h3>
            <p className="text-muted-foreground leading-relaxed">
              Za namen registracije, uporabe storitev, odgovora na povpraševanja, sodelovanja v promocijskih aktivnostih ter izvajanja naročniškega razmerja obdelujemo osebne podatke, ki jih posamezniki posredujejo prostovoljno, zlasti:
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong>Podatki staršev oziroma zakonitih zastopnikov:</strong>
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-2">
              <li>ime in priimek,</li>
              <li>elektronski naslov,</li>
              <li>po potrebi telefonska številka,</li>
              <li>podatki, povezani z naročniškim razmerjem in komunikacijo z upravljavcem,</li>
              <li>drugi podatki, ki jih posameznik prostovoljno posreduje v okviru komunikacije ali uporabe storitev.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong>Podatki otrok (ki jih vnese starš oziroma zakoniti zastopnik):</strong>
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-2">
              <li>ime ali vzdevek otroka,</li>
              <li>starost oziroma starostna skupina,</li>
              <li>podatki o govorno-jezikovnem razvoju otroka, ki jih starši oziroma zakoniti zastopniki posredujejo na podlagi izpolnjenega vprašalnika, in vključujejo splošne informacije o razumljivosti otrokovega govora ter morebitnih težavah pri izgovorjavi posameznih glasov ali besed (npr. težave pri izgovorjavi glasu R ali omejen obseg besedišča ipd.),</li>
              <li>drugi podatki, ki so potrebni za prilagoditev vsebin in spremljanje napredka.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Posredovanje določenih osebnih podatkov je pogoj za uporabo storitev platforme TomiTalk. Brez teh podatkov upravljavec ne more zagotoviti delovanja uporabniškega računa, izvajanja naročniških storitev ali prilagojenih vsebin.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">2) Podatki, ki se generirajo avtomatsko</h3>
            <p className="text-muted-foreground leading-relaxed">
              Ob uporabi spletnega mesta ali aplikacije se določeni podatki zbirajo samodejno, in sicer z namenom zagotavljanja varnega in učinkovitega delovanja sistema, analize uporabe ter izboljševanja uporabniške izkušnje.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Samodejno se lahko zbirajo naslednji podatki:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-2">
              <li>IP naslov ali delno anonimiziran IP naslov,</li>
              <li>podatki o napravi in brskalniku,</li>
              <li>podatki o operacijskem sistemu,</li>
              <li>jezikovne nastavitve,</li>
              <li>datum in čas dostopa,</li>
              <li>podatki o uporabi funkcionalnosti spletnega mesta ali aplikacije,</li>
              <li>drugi tehnični in statistični podatki (t. i. dnevniški oziroma log podatki).</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Ti podatki se praviloma obdelujejo v anonimizirani ali psevdonimizirani obliki in jih samih po sebi ni mogoče uporabiti za neposredno identifikacijo posameznika. Kadar se takšni podatki povežejo z osebnimi podatki uporabnika, se obravnavajo kot osebni podatki v skladu s to Politiko zasebnosti.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">3) Točnost podatkov</h3>
            <p className="text-muted-foreground leading-relaxed">
              Upravljavec ne odgovarja za točnost osebnih podatkov, ki jih vnesejo uporabniki. Uporabniki so dolžni zagotoviti, da so posredovani podatki točni, popolni in ažurni ter jih po potrebi posodobiti.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">POSREDOVANJE OSEBNIH PODATKOV TRETJIM OSEBAM ALI V TRETJE DRŽAVE</h2>
            <p className="text-muted-foreground leading-relaxed">
              Upravljavec osebnih podatkov se ne ukvarja s prodajo osebnih podatkov uporabnikov. Osebni podatki se posredujejo tretjim osebam izključno v obsegu in za namene, določene v tej Politiki zasebnosti ter v skladu z veljavno zakonodajo.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Posredovanje osebnih podatkov tretjim osebam</h3>
            <p className="text-muted-foreground leading-relaxed">
              Upravljavec lahko osebne podatke posreduje tretjim osebam v naslednjih primerih:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>kadar posameznik v to izrecno privoli,</li>
              <li>ponudnikom storitev, poslovnim partnerjem in izvajalcem, ki osebne podatke obdelujejo v imenu in po navodilih upravljavca ter so potrebni za delovanje platforme in podporo poslovanju, kot so:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                  <li>računovodski in davčni servis,</li>
                  <li>ponudniki za izdajanje in upravljanje računov oziroma ponudb,</li>
                  <li>drugi pogodbeni obdelovalci, ki zagotavljajo tehnično ali organizacijsko podporo storitvam.</li>
                </ul>
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Z vsemi takšnimi obdelovalci ima upravljavec sklenjene ustrezne pogodbe o obdelavi osebnih podatkov, skladno s 28. členom GDPR, ki zagotavljajo zaupnost in varnost obdelave.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Posredovanje podatkov pristojnim organom</h3>
            <p className="text-muted-foreground leading-relaxed">
              Upravljavec lahko osebne podatke razkrije pristojnim organom, kadar je to zahtevano z veljavno zakonodajo, sodno odločbo ali drugim zavezujočim pravnim aktom, ali kadar je razkritje potrebno za:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>preprečevanje ali preiskovanje nezakonitih dejanj,</li>
              <li>zaščito pravic, varnosti ali premoženja upravljavca, uporabnikov ali drugih oseb,</li>
              <li>preprečevanje zlorab ali goljufij v zvezi z uporabo storitev.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              V takih primerih se razkrijejo izključno tisti osebni podatki, ki so nujno potrebni za posamezen konkreten primer.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Obseg posredovanja</h3>
            <p className="text-muted-foreground leading-relaxed">
              Osebni podatki se tretjim osebam posredujejo le v najmanjšem možnem obsegu, ki je potreben za dosego zakonitega namena obdelave oziroma izpolnitev obveznosti do uporabnikov.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Posredovanje osebnih podatkov v tretje države</h3>
            <p className="text-muted-foreground leading-relaxed">
              Upravljavec praviloma ne posreduje osebnih podatkov v tretje države izven Evropske unije ali Evropskega gospodarskega prostora. Osebni podatki se obdelujejo pretežno znotraj Evropske unije.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              V primeru, da bi prišlo do prenosa osebnih podatkov v tretje države, bo upravljavec zagotovil ustrezne zaščitne ukrepe v skladu z GDPR ter o tem posameznike ustrezno obvestil.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Spletna analitika</h3>
            <p className="text-muted-foreground leading-relaxed">
              Za namene analize uporabe spletnega mesta in izboljševanja uporabniške izkušnje upravljavec uporablja orodja za spletno analitiko. Pri tem se obdelujejo anonimizirani ali psevdonimizirani podatki, ki ne omogočajo neposredne identifikacije posameznikov. Podatki, zbrani v ta namen, se lahko obdelujejo tudi na strežnikih izven Evropske unije, pri čemer upravljavec zagotavlja uporabo ustreznih zaščitnih ukrepov skladno z veljavno zakonodajo.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">PRIVOLITEV MLADOLETNIH OSEB</h2>
            <p className="text-muted-foreground leading-relaxed">
              Upravljavec je zavezan k varovanju zasebnosti otrok in zagotavljanju varne uporabe spletnih storitev. Platforma TomiTalk je namenjena staršem oziroma zakonitim zastopnikom otrok in ni namenjena neposredni uporabi s strani otrok brez nadzora odrasle osebe.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Upravljavec osebnih podatkov otrok ne zbira neposredno od otrok, mlajših od 15 let, temveč izključno preko staršev ali zakonitih zastopnikov, ki podatke posredujejo v imenu otroka in s tem potrjujejo, da imajo za to ustrezno starševsko oziroma skrbniško pravico.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Če bi upravljavec utemeljeno in razumno ugotovil, da so bili osebni podatki otroka, mlajšega od 15 let, posredovani brez soglasja nosilca starševske odgovornosti, bo takšne podatke brez odlašanja izbrisal ali drugače ustrezno zavaroval.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Starše oziroma zakonite zastopnike spodbujamo, da aktivno spremljajo uporabo spletnih storitev svojih otrok ter skrbijo za varno in odgovorno uporabo interneta.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Upravljavec uporablja razpoložljive tehnične in organizacijske ukrepe, s katerimi si prizadeva zagotoviti, da je privolitev za obdelavo osebnih podatkov otrok podana ali odobrena s strani nosilca starševske odgovornosti.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">AVTOMATIZIRANO SPREJEMANJE ODLOČITEV IN PROFILIRANJE</h2>
            <p className="text-muted-foreground leading-relaxed">
              Osebni podatki uporabnikov in otrok na platformi TomiTalk niso predmet avtomatiziranega sprejemanja odločitev v smislu 22. člena GDPR, ki bi imelo pravne učinke ali bi na posameznika podobno znatno vplivalo, prav tako niso predmet oblikovanja profilov v smislu GDPR.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Platforma lahko na podlagi vnesenih podatkov in uporabe storitev predlaga prilagojene vsebine, vaje ali priporočila, vendar takšna obdelava ne predstavlja avtomatiziranega odločanja ali profiliranja, temveč služi izključno podpori in prilagoditvi uporabniške izkušnje ter ne nadomešča strokovne presoje.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">KAKO VARUJEMO OSEBNE PODATKE</h2>
            <p className="text-muted-foreground leading-relaxed">
              Zaupanje uporabnikov in varstvo osebnih podatkov sta za upravljavca izjemnega pomena. Upravljavec zagotavlja varstvo osebnih podatkov z uporabo ustreznih tehničnih in organizacijskih ukrepov ter z izbiro zanesljivih zunanjih ponudnikov informacijskih storitev, ki zagotavljajo visoke varnostne standarde skladno z veljavno zakonodajo.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Osebni podatki se obdelujejo v varovanih informacijskih okoljih, ki jih zagotavljajo zunanji ponudniki storitev, in so zaščiteni z varnostnimi mehanizmi, kot so šifriranje podatkov, nadzor dostopa ter drugi ustrezni tehnični in organizacijski ukrepi.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Dostop do osebnih podatkov je omejen na upravljavca, pooblaščene osebe ter pogodbene obdelovalce, ki podatke potrebujejo za izvajanje storitev platforme TomiTalk in so zavezani k varovanju zaupnosti.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">POVEZAVE DO SPLETNIH STRANI TRETJIH OSEB</h2>
            <p className="text-muted-foreground leading-relaxed">
              Spletno mesto in aplikacija TomiTalk lahko vsebujeta povezave do spletnih strani ali storitev tretjih oseb, katerih lastniki ali upravljavci niso upravljavec. Uporaba teh storitev je prostovoljna in poteka na lastno odgovornost uporabnika.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Upravljavec ne odgovarja za vsebino, varnost ali prakse varstva osebnih podatkov tretjih oseb. Uporabnikom priporočamo, da se pred uporabo takšnih storitev seznanijo z njihovimi politikami zasebnosti.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">UPRAVLJANJE OSEBNIH PODATKOV IN ODJAVA (OPT-OUT)</h2>
            <p className="text-muted-foreground leading-relaxed">
              Uporabniki imajo pravico, da kadarkoli upravljajo svoje osebne podatke, jih posodobijo, zahtevajo njihov izbris ali prekličejo dano privolitev za obdelavo osebnih podatkov, skladno z veljavno zakonodajo.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Posodobitev osebnih podatkov</h3>
            <p className="text-muted-foreground leading-relaxed">
              Če želite še naprej uporabljati storitve platforme TomiTalk in hkrati spremeniti ali posodobiti svoje osebne podatke (npr. ime, elektronski naslov ali druge kontaktne podatke), lahko to storite preko uporabniškega računa ali nam to sporočite na elektronski naslov <a href="mailto:info@tomitalk.si" className="text-dragon-green hover:underline">info@tomitalk.si</a>.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Izbris osebnih podatkov</h3>
            <p className="text-muted-foreground leading-relaxed">
              Če želite, da se vaši osebni podatki v celoti izbrišejo iz evidenc upravljavca, lahko pošljete zahtevo za izbris na elektronski naslov <a href="mailto:info@tomitalk.si" className="text-dragon-green hover:underline">info@tomitalk.si</a>. Upravljavec bo zahtevo obravnaval v skladu z veljavno zakonodajo in vas o izvedbi obvestil.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Odjava od obveščanja (opt-out)</h3>
            <p className="text-muted-foreground leading-relaxed">
              Če ne želite več prejemati elektronskih sporočil ali drugih marketinških obvestil, se lahko kadarkoli odjavite s klikom na povezavo »odjava«, ki je vključena v vsakem takšnem sporočilu, ali pa svojo zahtevo pošljete na elektronski naslov <a href="mailto:info@tomitalk.si" className="text-dragon-green hover:underline">info@tomitalk.si</a>. Upravljavec bo vašo odločitev spoštoval.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Obravnava zahtev</h3>
            <p className="text-muted-foreground leading-relaxed">
              Upravljavec bo zahteve za posodobitev, izbris ali odjavo obravnaval brez nepotrebnega odlašanja, najpozneje pa v zakonsko določenem roku. O izvedbi zahteve boste ustrezno obveščeni.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Po prejemu preklica privolitve bo upravljavec prenehal z obdelavo osebnih podatkov, na katere se preklic nanaša, in jih izbrisal, razen če za nadaljnjo obdelavo obstaja druga zakonita pravna podlaga. O tem boste obveščeni.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">PRAVICE POSAMEZNIKOV</h2>
            <p className="text-muted-foreground leading-relaxed">
              V skladu z določbami Splošne uredbe o varstvu podatkov (GDPR) ima posameznik naslednje pravice v zvezi z obdelavo osebnih podatkov:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>pravico do dostopa do osebnih podatkov,</li>
              <li>pravico do popravka netočnih ali nepopolnih osebnih podatkov,</li>
              <li>pravico do izbrisa osebnih podatkov (»pravica do pozabe«),</li>
              <li>pravico do omejitve obdelave osebnih podatkov,</li>
              <li>pravico do prenosljivosti osebnih podatkov,</li>
              <li>pravico do ugovora obdelavi osebnih podatkov,</li>
              <li>pravico do vložitve pritožbe pri nadzornem organu.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Za uveljavljanje svojih pravic ali za pridobitev dodatnih informacij v zvezi z obdelavo osebnih podatkov se lahko posameznik obrne na upravljavca preko elektronskega naslova <a href="mailto:info@tomitalk.si" className="text-dragon-green hover:underline">info@tomitalk.si</a>.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Upravljavec bo na zahtevo odgovoril brez nepotrebnega odlašanja in najpozneje v roku enega meseca od prejema zahteve. Ta rok se lahko v skladu z GDPR po potrebi podaljša za največ dva dodatna meseca, o čemer bo posameznik pravočasno obveščen.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Kadar obstaja utemeljen dvom glede identitete posameznika, ki uveljavlja svoje pravice, lahko upravljavec zahteva dodatne informacije, potrebne za potrditev identitete, da se prepreči nepooblaščen dostop do osebnih podatkov.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Če so zahteve posameznika očitno neutemeljene ali pretirane, zlasti če se ponavljajo, lahko upravljavec v skladu z GDPR zaračuna razumno pristojbino, ki upošteva administrativne stroške obravnave zahteve, ali pa zahtevo zavrne. O razlogih za takšno odločitev bo posameznik ustrezno obveščen.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Posameznik ima pravico vložiti pritožbo pri nadzornem organu, in sicer pri Informacijskem pooblaščencu Republike Slovenije.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">PRAVICA DO DOSTOPA DO OSEBNIH PODATKOV</h2>
            <p className="text-muted-foreground leading-relaxed">
              Posameznik, na katerega se nanašajo osebni podatki, ima pravico od upravljavca pridobiti potrditev, ali se v zvezi z njim obdelujejo osebni podatki, in kadar je temu tako, pravico do dostopa do osebnih podatkov ter do naslednjih informacij v zvezi z njihovo obdelavo:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>nameni obdelave osebnih podatkov,</li>
              <li>vrste osebnih podatkov, ki se obdelujejo,</li>
              <li>uporabniki ali kategorije uporabnikov, katerim so bili ali jim bodo osebni podatki razkriti, zlasti uporabniki v tretjih državah ali mednarodnih organizacijah,</li>
              <li>kadar je mogoče, predvideno obdobje hrambe osebnih podatkov ali, če to ni mogoče, merila za določitev tega obdobja,</li>
              <li>obstoj pravice zahtevati popravek ali izbris osebnih podatkov, omejitev obdelave ali pravico do ugovora obdelavi osebnih podatkov,</li>
              <li>pravico do vložitve pritožbe pri nadzornem organu,</li>
              <li>kadar osebni podatki niso zbrani neposredno od posameznika, vse razpoložljive informacije v zvezi z njihovim virom,</li>
              <li>obstoj avtomatiziranega sprejemanja odločitev, vključno z oblikovanjem profilov, ter smiselne informacije o razlogih zanj ter o pomenu in predvidenih posledicah takšne obdelave za posameznika.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Na podlagi zahteve posameznika upravljavec zagotovi kopijo osebnih podatkov, ki se obdelujejo. Za dodatne kopije, ki jih zahteva posameznik, lahko upravljavec zaračuna razumno pristojbino ob upoštevanju administrativnih stroškov.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Zahteve za uveljavljanje pravice do dostopa lahko posameznik naslovi na elektronski naslov <a href="mailto:info@tomitalk.si" className="text-dragon-green hover:underline">info@tomitalk.si</a>. Upravljavec bo zahtevo obravnaval v skladu z določbami GDPR in v zakonsko določenih rokih.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">PRAVICA DO POPRAVKA</h2>
            <p className="text-muted-foreground leading-relaxed">
              Posameznik, na katerega se nanašajo osebni podatki, ima pravico, da upravljavec brez nepotrebnega odlašanja popravi netočne osebne podatke v zvezi z njim. Ob upoštevanju namenov obdelave ima posameznik tudi pravico do dopolnitve nepopolnih osebnih podatkov, vključno s predložitvijo dopolnilne izjave.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Zahtevo za popravek ali dopolnitev osebnih podatkov lahko posameznik posreduje upravljavcu preko elektronskega naslova <a href="mailto:info@tomitalk.si" className="text-dragon-green hover:underline">info@tomitalk.si</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">PRAVICA DO IZBRISA (»PRAVICA DO POZABE«)</h2>
            <p className="text-muted-foreground leading-relaxed">
              Posameznik, na katerega se nanašajo osebni podatki, ima pravico doseči, da upravljavec brez nepotrebnega odlašanja izbriše osebne podatke v zvezi z njim, kadar je izpolnjen eden od naslednjih pogojev:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>osebni podatki niso več potrebni za namene, za katere so bili zbrani ali kako drugače obdelani,</li>
              <li>posameznik prekliče privolitev, ki je podlaga za obdelavo osebnih podatkov, in za obdelavo ne obstaja nobena druga pravna podlaga,</li>
              <li>posameznik ugovarja obdelavi osebnih podatkov na podlagi zakonitega interesa upravljavca, za njihovo obdelavo pa ne obstajajo prevladujoči zakoniti razlogi,</li>
              <li>posameznik ugovarja obdelavi osebnih podatkov za namene neposrednega trženja,</li>
              <li>osebne podatke je treba izbrisati zaradi izpolnitve pravne obveznosti v skladu s pravom Evropske unije ali slovenskim pravnim redom,</li>
              <li>osebni podatki so bili nezakonito zbrani v zvezi s ponujanjem storitev informacijske družbe otroku, ki v skladu z veljavno zakonodajo ne more veljavno podati privolitve.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Kadar so bili osebni podatki javno objavljeni, bo upravljavec ob upoštevanju razpoložljive tehnologije in stroškov izvedbe sprejel razumne ukrepe, vključno s tehničnimi ukrepi, da obvesti druge upravljavce, ki obdelujejo osebne podatke, da posameznik zahteva izbris vseh povezav do teh osebnih podatkov ali njihovih kopij.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Upravljavec bo zahteve za izbris obravnaval v skladu z določbami GDPR in veljavno zakonodajo.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">PRAVICA DO OMEJITVE OBDELAVE</h2>
            <p className="text-muted-foreground leading-relaxed">
              Posameznik, na katerega se nanašajo osebni podatki, ima pravico, da omejimo obdelavo, kadar:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>posameznik oporeka točnosti podatkov, in sicer za obdobje, za katero lahko preverimo točnost osebnih podatkov;</li>
              <li>je obdelava nezakonita in posameznik nasprotuje izbrisu osebnih podatkov ter namesto tega zahteva omejitev njihove uporabe;</li>
              <li>osebnih podatkov ne potrebujemo več za namene obdelave, temveč jih posameznik, na katerega se nanašajo osebni podatki, potrebuje za uveljavljanje, izvajanje ali obrambo pravnih zahtevkov;</li>
              <li>je posameznik vložil ugovor v zvezi z obdelavo, dokler se ne preveri, ali naši zakoniti razlogi prevladajo nad razlogi posameznika, na katerega se nanašajo osebni podatki.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">PRAVICA DO PRENOSLJIVOSTI PODATKOV</h2>
            <p className="text-muted-foreground leading-relaxed">
              Posameznik, na katerega se nanašajo osebni podatki, ima pravico, da prejme osebne podatke v zvezi z njim, ki jih posedujemo, v strukturirani, splošno uporabljani in strojno berljivi obliki, in pravico, da te podatke posreduje drugemu upravljavcu, ne da bi ga pri slednjem ovirali, kadar:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>obdelava temelji na privolitvi posameznika ali pogodbi ali kadar se obdelava izvaja z avtomatiziranimi sredstvi.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">PRAVICA DO UGOVORA</h2>
            <p className="text-muted-foreground leading-relaxed">
              Posameznik, na katerega se nanašajo osebni podatki, ima pravico, da na podlagi razlogov, povezanih z njegovim posebnim položajem, kadar koli ugovarja obdelavi osebnih podatkov, kadar ta temelji na zakonitem interesu upravljavca ali tretje osebe.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              V takem primeru bo upravljavec prenehal z obdelavo osebnih podatkov, razen če dokaže nujne zakonite razloge za obdelavo, ki prevladajo nad interesi, pravicami in svoboščinami posameznika, ali kadar je obdelava potrebna za uveljavljanje, izvajanje ali obrambo pravnih zahtevkov.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Kadar se osebni podatki obdelujejo za namene neposrednega trženja, ima posameznik pravico, da kadar koli ugovarja obdelavi osebnih podatkov v zvezi z njim za namene takšnega trženja. V primeru ugovora se osebni podatki za namene neposrednega trženja ne bodo več obdelovali. Kadar neposredno trženje temelji na privolitvi, lahko posameznik to pravico uveljavi tudi s preklicem dane privolitve.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Zahtevo za uveljavljanje pravice do ugovora lahko posameznik posreduje upravljavcu preko elektronskega naslova <a href="mailto:info@tomitalk.si" className="text-dragon-green hover:underline">info@tomitalk.si</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">AVTOMATIZIRANO INDIVIDUALNO ODLOČANJE, VKLJUČNO S PROFILIRANJEM</h2>
            <p className="text-muted-foreground leading-relaxed">
              Posameznik ima pravico, da zanj ne veljajo odločitve, ki temeljijo izključno na avtomatizirani obdelavi osebnih podatkov, vključno s profiliranjem, in bi imele pravne učinke ali bi nanj podobno znatno vplivale.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Platforma TomiTalk ne izvaja avtomatiziranega individualnega odločanja ali profiliranja v smislu GDPR. Morebitna uporaba avtomatiziranih orodij služi izključno podpori delovanja platforme in personalizaciji vsebin ter ne povzroča pravnih ali podobno pomembnih učinkov za posameznika, niti ne nadomešča človeške presoje.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">PRAVICA DO VLOŽITVE PRITOŽBE V ZVEZI Z OBDELOVANJEM OSEBNIH PODATKOV</h2>
            <p className="text-muted-foreground leading-relaxed">
              Posameznik lahko morebitno pritožbo v zvezi z obdelavo osebnih podatkov naslovi na upravljavca preko elektronskega naslova <a href="mailto:info@tomitalk.si" className="text-dragon-green hover:underline">info@tomitalk.si</a> ali po pošti na naslov: Robert Kujavec s.p., Dobrnič 13, 8211 Dobrnič.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              V primeru kršitve varstva osebnih podatkov bo upravljavec o tem obvestil pristojni nadzorni organ, razen kadar je verjetno, da s kršitvijo niso bile ogrožene pravice in svoboščine posameznikov.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Če obstaja utemeljen sum, da je bila s kršitvijo storjena kazniva dejavnost, bo upravljavec o tem obvestil policijo in/ali pristojno tožilstvo.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Če bi kršitev varstva osebnih podatkov lahko povzročila veliko tveganje za pravice in svoboščine posameznikov, bo upravljavec o kršitvi brez nepotrebnega odlašanja obvestil tudi posameznike, na katere se osebni podatki nanašajo.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Če je posameznik pri upravljavcu uveljavljal pravico do dostopa do osebnih podatkov in po prejemu odgovora meni, da prejeti podatki niso skladni z njegovo zahtevo ali da niso bili posredovani vsi zahtevani osebni podatki, lahko pred vložitvijo pritožbe pri nadzornem organu vloži obrazloženo pritožbo pri upravljavcu. Upravljavec bo takšno pritožbo obravnaval kot novo zahtevo in nanjo odgovoril v skladu z veljavno zakonodajo.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Ne glede na navedeno ima posameznik pravico vložiti pritožbo pri pristojnem nadzornem organu, če meni, da so mu bile kršene pravice ali predpisi s področja varstva osebnih podatkov, in sicer pri:
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong>Informacijskem pooblaščencu Republike Slovenije</strong><br />
              Zaloška cesta 59, 1000 Ljubljana<br />
              telefon: 01 230 97 30<br />
              e-pošta: <a href="mailto:gp.ip@ip-rs.si" className="text-dragon-green hover:underline">gp.ip@ip-rs.si</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">ČAS HRAMBE OSEBNIH PODATKOV</h2>
            <p className="text-muted-foreground leading-relaxed">
              Upravljavec osebne podatke hrani le toliko časa, kolikor je to potrebno za uresničitev namena, za katerega so bili osebni podatki zbrani in nadalje obdelovani, oziroma v skladu z veljavno zakonodajo.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Osebni podatki, ki se obdelujejo na podlagi privolitve posameznika, se hranijo do preklica privolitve, razen če zakon določa drugače ali če obstaja druga zakonita podlaga za nadaljnjo obdelavo.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Osebni podatki, ki se obdelujejo na podlagi pogodbenega razmerja oziroma za izvajanje ukrepov na zahtevo posameznika pred sklenitvijo pogodbe, se hranijo za čas trajanja pogodbenega razmerja in še toliko časa po njegovem prenehanju, kolikor je to potrebno za uveljavljanje ali obrambo morebitnih pravnih zahtevkov oziroma do poteka zakonsko določenih zastaralnih rokov.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Osebni podatki, ki se obdelujejo na podlagi zakonitega interesa upravljavca, se hranijo največ pet let od izpolnitve namena obdelave oziroma do poteka zastaralnih rokov za morebitne zahtevke, razen če zakon določa drugače.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              V primerih, ko veljavna zakonodaja (npr. davčna ali računovodska zakonodaja) določa obvezne roke hrambe osebnih podatkov, se osebni podatki hranijo v skladu s temi zakonskimi roki in se po njihovem poteku izbrišejo ali anonimizirajo.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Nekateri podatki se lahko zbirajo tudi z uporabo piškotkov in podobnih tehnologij za namen zagotavljanja delovanja spletnega mesta, analize uporabe in izboljševanja uporabniške izkušnje. Podrobnejše informacije o tem so na voljo v Politiki piškotkov.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">POVEZAVE DO DRUGIH SPLETNIH MEST</h2>
            <p className="text-muted-foreground leading-relaxed">
              Spletno mesto in aplikacija TomiTalk lahko vsebujeta povezave do spletnih mest ali storitev tretjih oseb, katerih lastniki ali upravljavci niso upravljavec. Ta spletna mesta imajo lastne politike zasebnosti in piškotkov, s katerimi se mora uporabnik seznaniti sam.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Upravljavec ne prevzema odgovornosti za vsebino, delovanje ali prakse varstva osebnih podatkov teh tretjih oseb.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">PIŠKOTKI</h2>
            <p className="text-muted-foreground leading-relaxed">
              Piškotki so majhne besedilne datoteke, ki jih spletno mesto shrani v napravo uporabnika, s katero dostopa do interneta. Piškotki omogočajo pravilno delovanje spletnega mesta, izboljšujejo uporabniško izkušnjo ter pomagajo pri analizi uporabe spletnega mesta. Shranjevanje piškotkov je pod nadzorom uporabnika, saj lahko v nastavitvah svojega spletnega brskalnika uporabo piškotkov omeji ali onemogoči.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Piškotki opravljajo različne funkcije, med drugim omogočajo osnovno delovanje spletnega mesta, shranjevanje uporabniških nastavitev, analizo obiska ter izboljševanje vsebin in storitev glede na potrebe uporabnikov. Na podlagi anonimnih statističnih podatkov o obiskanosti lahko upravljavec ocenjuje učinkovitost delovanja spletnega mesta in uporabniško izkušnjo.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Vrste piškotkov</h3>
            <p className="text-muted-foreground leading-relaxed">
              Spletno mesto TomiTalk uporablja naslednje vrste piškotkov:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li><strong>Nujni piškotki:</strong> Ti piškotki so potrebni za osnovno delovanje spletnega mesta in omogočajo uporabo njegovih ključnih funkcionalnosti. Brez teh piškotkov spletno mesto ne deluje pravilno, zato se nameščajo ne glede na privolitev uporabnika.</li>
              <li><strong>Analitični in statistični piškotki:</strong> Ti piškotki se uporabljajo za zbiranje anonimnih podatkov o uporabi spletnega mesta, kar omogoča izboljševanje vsebin in delovanja spletnega mesta. Namestitev teh piškotkov se izvede le na podlagi predhodne privolitve uporabnika.</li>
              <li><strong>Drugi piškotki (če se uporabljajo):</strong> Morebitni dodatni piškotki, ki niso nujni za delovanje spletnega mesta, se namestijo izključno na podlagi izrecne privolitve uporabnika.</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Privolitev za uporabo piškotkov</h3>
            <p className="text-muted-foreground leading-relaxed">
              Uporabnik lahko ob prvem obisku spletnega mesta poda privolitev za uporabo posameznih vrst piškotkov preko ustreznega obvestila oziroma orodja za upravljanje piškotkov. Privolitev lahko uporabnik kadarkoli spremeni ali prekliče.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Kako upravljam ali izklopim piškotke?</h3>
            <p className="text-muted-foreground leading-relaxed">
              Uporabnik lahko uporabo piškotkov kadarkoli omeji ali onemogoči v nastavitvah svojega spletnega brskalnika. Upoštevati je treba, da onemogočanje nekaterih piškotkov lahko vpliva na delovanje spletnega mesta ali uporabniško izkušnjo.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Navodila za upravljanje piškotkov so na voljo v nastavitvah posameznega brskalnika (npr. Chrome, Firefox, Safari, Edge).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">KATERE PIŠKOTKE UPORABLJAMO?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Na spletnem mestu in v aplikaciji TomiTalk uporabljamo nujno potrebne in funkcionalne piškotke ter druge primerljive tehnologije shranjevanja (npr. localStorage in sessionStorage), ki omogočajo pravilno delovanje storitve, prijavo uporabnikov in boljšo uporabniško izkušnjo.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Piškotki</h3>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border px-4 py-2 text-left text-foreground">Piškotek</th>
                    <th className="border border-border px-4 py-2 text-left text-foreground">Trajanje</th>
                    <th className="border border-border px-4 py-2 text-left text-foreground">Namen</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border px-4 py-2 text-muted-foreground">sidebar:state</td>
                    <td className="border border-border px-4 py-2 text-muted-foreground">7 dni</td>
                    <td className="border border-border px-4 py-2 text-muted-foreground">Shranjuje stanje stranskega menija (odprt/zaprt) za izboljšano uporabniško izkušnjo.</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-2 text-muted-foreground">auth-token</td>
                    <td className="border border-border px-4 py-2 text-muted-foreground">Seja</td>
                    <td className="border border-border px-4 py-2 text-muted-foreground">Avtentikacijski piškotek, ki ga ustvari storitev Supabase in omogoča varno prijavo uporabnika.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Ti piškotki so nujni za delovanje aplikacije in se nameščajo ne glede na privolitev uporabnika.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Druge tehnologije shranjevanja podatkov (niso piškotki)</h3>
            <p className="text-muted-foreground leading-relaxed">
              Poleg piškotkov aplikacija uporablja tudi localStorage, sessionStorage in Service Worker predpomnjenje, ki niso piškotki, vendar se obravnavajo kot podobne tehnologije.
            </p>

            <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">LocalStorage</h4>
            <div className="overflow-x-auto mt-2">
              <table className="min-w-full border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border px-4 py-2 text-left text-foreground">Ključ</th>
                    <th className="border border-border px-4 py-2 text-left text-foreground">Namen</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border px-4 py-2 text-muted-foreground">pwa-install-dismissed</td>
                    <td className="border border-border px-4 py-2 text-muted-foreground">Beleži, ali je uporabnik zavrnil poziv za namestitev aplikacije (PWA).</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-2 text-muted-foreground">ios-install-dismissed</td>
                    <td className="border border-border px-4 py-2 text-muted-foreground">Beleži zavrnitev iOS navodil za namestitev.</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-2 text-muted-foreground">vaje-motorike-govoril-progress</td>
                    <td className="border border-border px-4 py-2 text-muted-foreground">Shranjuje napredek otroka pri vajah.</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-2 text-muted-foreground">trophy_dialog_shown_[id]</td>
                    <td className="border border-border px-4 py-2 text-muted-foreground">Beleži prikaz obvestila o doseženi trofeji.</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-2 text-muted-foreground">expandSection</td>
                    <td className="border border-border px-4 py-2 text-muted-foreground">Začasno shranjuje razširjen odsek uporabniškega profila.</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-2 text-muted-foreground">theme</td>
                    <td className="border border-border px-4 py-2 text-muted-foreground">Shranjuje izbiro teme (svetla/temna).</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-4 py-2 text-muted-foreground">migration-completed-[id]</td>
                    <td className="border border-border px-4 py-2 text-muted-foreground">Beleži zaključek migracije podatkov.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">SessionStorage</h4>
            <div className="overflow-x-auto mt-2">
              <table className="min-w-full border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border px-4 py-2 text-left text-foreground">Ključ</th>
                    <th className="border border-border px-4 py-2 text-left text-foreground">Namen</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border px-4 py-2 text-muted-foreground">splashShow</td>
                    <td className="border border-border px-4 py-2 text-muted-foreground">Beleži, ali je bil v tekoči seji prikazan uvodni zaslon.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">Service Worker Cache</h4>
            <p className="text-muted-foreground leading-relaxed">
              Aplikacija uporablja service worker, ki začasno predpomni statične datoteke za omogočanje hitrejšega nalaganja in delnega delovanja brez povezave. Ta mehanizem ne omogoča identifikacije uporabnika.
            </p>

            <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Analitični in marketinški piškotki</h3>
            <p className="text-muted-foreground leading-relaxed">
              Trenutno ne uporabljamo analitičnih ali marketinških piškotkov (npr. Google Analytics, Facebook Pixel ipd.). V primeru, da se to v prihodnosti spremeni, bo uporabnik o tem pravočasno obveščen in bo za takšne piškotke zahtevana izrecna privolitev.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">UPRAVLJANJE IN BRISANJE PIŠKOTKOV</h2>
            <p className="text-muted-foreground leading-relaxed">
              Uporabnik lahko kadar koli spremeni način uporabe piškotkov v svojem spletnem brskalniku, vključno z blokiranjem ali izbrisom piškotkov, z ustrezno spremembo nastavitev brskalnika. Večina brskalnikov omogoča sprejem ali zavrnitev vseh piškotkov, sprejem samo določenih vrst piškotkov ali obvestilo uporabniku, ko spletno mesto želi shraniti piškotek.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Piškotke, ki jih je brskalnik že shranil, lahko uporabnik kadar koli izbriše. Če uporabnik spremeni ali izbriše datoteko s piškotki, posodobi ali zamenja brskalnik ali napravo, bo morda moral ponovno nastaviti svoje izbire glede piškotkov.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Postopek za upravljanje in brisanje piškotkov se razlikuje glede na uporabljeni brskalnik (npr. Chrome, Firefox, Safari, Edge). Podrobna navodila so na voljo v nastavitvah posameznega brskalnika ali na spletni strani njegovega ponudnika.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Upoštevati je treba, da onemogočanje ali brisanje nekaterih piškotkov lahko vpliva na delovanje spletnega mesta ali uporabniško izkušnjo.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">SPREMEMBE POLITIKE ZASEBNOSTI IN PIŠKOTKOV</h2>
            <p className="text-muted-foreground leading-relaxed">
              Pridržujemo si pravico, da po lastni presoji kadar koli posodobimo, spremenimo ali dopolnimo to Politiko zasebnosti in piškotkov. Vsaka sprememba bo objavljena na spletnem mestu TomiTalk in začne veljati z dnem objave, razen če je izrecno navedeno drugače.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Uporabnikom priporočamo, da občasno preverijo Politiko zasebnosti in piškotkov, da ostanejo seznanjeni z morebitnimi spremembami.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-6 text-sm italic">
              Objavljeno dne: 3. 1. 2026
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
                  src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_0.webp"
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
