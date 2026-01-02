import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const SplosniPogoji = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Nazaj
        </Button>
        
        <h1 className="text-3xl font-bold text-dragon-green mb-8">Splošni pogoji</h1>
        
        <div className="prose prose-slate max-w-none space-y-6">
          
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. SPLOŠNE DOLOČBE</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nosilec spletne platforme »TomiTalk« (v nadaljevanju: »Platforma«) je TomiTalk, Robert Kujavec s.p., Dobrnič 13, 8211, Dobrnič, davčna številka: 63740311 (v nadaljevanju: »Robert Kujavec s.p. ali Nosilec platforme«), ki deluje skladno z veljavno zakonodajo in predmetnimi Splošnimi pogoji poslovanja (v nadaljevanju: »Splošni pogoji«).
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Splošni pogoji poslovanja določajo pravice in obveznosti pogodbenih strank, na eni strani Nosilca platforme, na drugi strani pa uporabnika storitev, ki jih nudi in opravlja Nosilec platforme, ter določajo način, ceno, vsebino in pogoje poslovanja. Nosilec platforme organizira dostop do spletnega orodja oziroma storitve, imenovane TomiTalk, s katero lahko uporabniki dostopajo do digitalnih vsebin in funkcionalnosti, namenjenih podpori govorno-jezikovnemu razvoju otrok, vključno z interaktivnimi vajami, igrami, gradivi ter spremljevalnimi funkcijami za starše oziroma zakonite skrbnike.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Platforma TomiTalk je zasnovana kot podporno digitalno orodje, ki lahko vključuje tudi funkcionalnosti obdelave govora oziroma analize posnetkov, pri čemer se rezultati in priporočila pripravijo v skladu z načinom delovanja platforme in pogoji, opredeljenimi v teh Splošnih pogojih. Če platforma vključuje strokovni pregled posnetkov (npr. s strani logopedov) ter pripravo poročil, se to izvaja v skladu s pogoji in obsegom storitev, kot so opisani na Platformi.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Uporaba spletne strani in spletnega orodja na spletni strani se šteje kot soglasje uporabnika spletne strani s predmetnimi Splošnimi pogoji. Storitev ne uporabljajte, v kolikor se s Splošnimi pogoji ne strinjate.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Storitve so na voljo vsem, ki se strinjajo s Splošnimi pogoji, ki so javno objavljeni na platformi TomiTalk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. DEFINICIJE</h2>
            <p className="text-muted-foreground leading-relaxed">
              Posamezni izrazi, zapisani z veliko začetnico, uporabljeni v predmetnih Splošnih pogojih, imajo naslednji pomen:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-3 mt-4">
              <li><strong>»Uporabnik«, »Stranka«, »Vi«, »Vas«</strong> se nanaša na fizične ali pravne osebe, ki dostopajo do spletne strani, uporabljajo platformo TomiTalk, z Nosilcem platforme komunicirajo preko kontaktnih podatkov, objavljenih na Platformi, in/ali uporabljajo Storitve. Uporaba navedenih izrazov se nanaša tudi na osebe, ki v imenu Uporabnika dostopajo do Platforme ali uporabljajo Storitve, zlasti na starše ali zakonite skrbnike, ki v imenu mladoletnih oseb uporabljajo Platformo TomiTalk.</li>
              <li><strong>»Otrok«</strong> pomeni mladoletno osebo, za katero Uporabnik (starš ali zakoniti skrbnik) ustvari uporabniški profil na Platformi in v imenu katere se izvajajo vaje, aktivnosti, snemanja govora, testi, igre ali druge funkcionalnosti Platforme.</li>
              <li><strong>»Nosilec platforme«, »Nosilec«</strong> pomeni pravno ali fizično osebo, ki skrbi za vzpostavitev, upravljanje, razvoj, vzdrževanje in delovanje Platforme TomiTalk, organizacijo dostopa do vsebin in funkcionalnosti ter obračunavanje opravljenih storitev.</li>
              <li><strong>»Naročnik«</strong> pomeni fizično ali pravno osebo, ki z Nosilcem platforme sklene pogodbo o naročništvu ali drugo pogodbo, na podlagi katere pridobi pravico do uporabe plačljivih storitev, vsebin ali funkcionalnosti Platforme TomiTalk.</li>
              <li><strong>»Naročnina«</strong> pomeni mesečno, letno ali drugo časovno določeno plačilo, ki ga Naročnik plača Nosilcu platforme za uporabo Storitev, vsebin ali funkcionalnosti Platforme TomiTalk, skladno z veljavnim Cenikom.</li>
              <li><strong>»Registriran uporabnik«</strong> pomeni Uporabnika, ki se samostojno registrira na Platformi z uporabo elektronskega naslova in drugih zahtevanih podatkov ter ima dostop do zaprtega dela Platforme, vključno z osebnim uporabniškim profilom in funkcionalnostmi, vezanimi na uporabniški račun.</li>
              <li><strong>»Neregistriran uporabnik«</strong> pomeni osebo, ki do Platforme dostopa anonimno, brez registracije, uporabniškega imena in gesla, in ima dostop izključno do javno dostopnega dela Platforme.</li>
              <li><strong>»Cenik«</strong> pomeni dokument ali sklop informacij, javno objavljen na Platformi, s katerim Nosilec platforme določa cene naročniških paketov, dodatnih storitev, plačljivih vsebin ali drugih funkcionalnosti Platforme TomiTalk. Nosilec si pridržuje pravico, da Cenik kadarkoli spremeni ali dopolni, pri čemer spremembe začnejo veljati z objavo na Platformi.</li>
              <li><strong>»Storitve«</strong> pomenijo vse dejavnosti, funkcionalnosti in digitalne storitve, ki jih Nosilec platforme zagotavlja Uporabnikom ali Naročnikom v okviru Platforme TomiTalk, vključno, vendar ne omejeno na: dostop do vaj, iger, testov, vsebin, spremljanje napredka, obdelavo posnetkov, generiranje poročil ter druge podporne funkcije. Pod Storitve ne sodijo individualne zdravstvene ali logopedske obravnave v živo, razen če je izrecno navedeno drugače.</li>
              <li><strong>»TomiTalk«</strong> pomeni digitalno spletno in/ali mobilno platformo, namenjeno podpori govornojezikovnemu razvoju otrok, ki vključuje interaktivne vaje, igre, teste, gradiva, spremljanje napredka ter druge funkcionalnosti, zasnovane za uporabo s strani staršev ali zakonitih skrbnikov.</li>
              <li><strong>»Test izgovorjave«</strong> pomeni strukturirano aktivnost na Platformi, pri kateri Otrok izgovarja vnaprej določene besede ali glasove, pri čemer se lahko posnetki shranjujejo, obdelujejo ali pregledajo skladno s funkcionalnostmi Platforme in predmetnimi Splošnimi pogoji.</li>
              <li><strong>»Poročilo«</strong> pomeni povzetek ugotovitev, opažanj ali rezultatov, pripravljen na podlagi uporabe Platforme, ki lahko vključuje tudi strokovni pregled posnetkov s strani logopedov ali drugih strokovnjakov, če je takšna storitev del ponujenega paketa.</li>
              <li><strong>»Platforma«, »Spletna stran«, »TomiTalk«</strong> se nanaša na spletno stran TomiTalk, vse njene podstrani, poddomene, vsebine, funkcionalnosti, storitve, produkte in povezane digitalne elemente.</li>
              <li><strong>»Pogodba o naročništvu« oziroma »Pogodba o dobavi digitalne vsebine«</strong> pomeni pogodbeno razmerje med Naročnikom in Nosilcem platforme, sklenjeno na daljavo, na podlagi katere Naročnik pridobi pravico do uporabe plačljivih vsebin ali Storitev Platforme TomiTalk.</li>
              <li><strong>»Vsebine« oziroma »Digitalne vsebine«</strong> pomenijo vse informacije, besedila, slike, grafike, video posnetke, zvočne posnetke, aplikacije, programsko opremo, podatke, oblikovne elemente in druge materiale, ki so dostopni na Platformi ali jih Nosilec platforme posreduje Uporabnikom na kakršen koli način.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. DELOVANJE PLATFORME</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nosilec platforme vzdržuje Platformo TomiTalk tako, da je ta praviloma dostopna štiriindvajset (24) ur na dan in vse dni v letu. Nosilec platforme ne zagotavlja, da bo Platforma ves čas delovala neprekinjeno, brez motenj, tehničnih napak ali drugih pomanjkljivosti.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Nosilec platforme si pridržuje pravico do začasnih prekinitev dostopa do Platforme zaradi vzdrževalnih del, nadgradenj sistema, tehničnih izboljšav ali drugih posegov, potrebnih za nemoteno delovanje Platforme. Vzdrževalna dela bodo praviloma potekala v nočnem času in/ali med vikendi, kadar je to mogoče, vendar Nosilec platforme ne jamči, da bodo vsa vzdrževalna dela izvedena izključno v teh terminih.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Možni so tudi izpadi dostopa do Platforme TomiTalk zaradi izpada delovanja, tehničnih napak ali motenj opreme in sistemov na strani Nosilca platforme, ponudnikov internetnih storitev, zunanjih ponudnikov tehnologij, ali zaradi težav z opremo, programsko opremo ali internetno povezavo na strani Uporabnika. Nosilec platforme za takšne izpade ali motnje ne prevzema nobene odgovornosti.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Odgovornost Nosilca platforme za kakršnokoli neposredno ali posredno škodo, izgubo podatkov, izgubo dostopa, izgubo uporabe, nevšečnosti ali druge posledice, ki bi Uporabniku ali Naročniku nastale zaradi začasne ali trajne prekinitve delovanja Platforme, motenega dostopa do Platforme TomiTalk, do povezanih storitev ali do povezanih spletnih strani, je v celoti izključena, razen v primerih, ko je taka odgovornost izrecno določena z veljavno zakonodajo.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Z uporabo Platforme se Uporabnik izrecno strinja, da brez predhodnega pisnega dovoljenja Nosilca platforme ne bo kopiral, razmnoževal, spreminjal, distribuiral, javno prikazoval, posredoval tretjim osebam ali kako drugače uporabljal kakršnekoli vsebine, funkcionalnosti, podatke ali dele Platforme TomiTalk, razen v obsegu, ki je nujno potreben za osebno in zakonito uporabo Platforme skladno s temi Splošnimi pogoji.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Nosilec platforme ne prevzema odgovornosti za morebitne napake, netočnosti ali pomanjkljivosti v informacijah, vsebinah ali rezultatih, ki so na voljo na Platformi, niti za morebitno napačno razumevanje ali uporabo teh vsebin s strani Uporabnika. Uporabniki z uporabo Platforme izrecno priznavajo in soglašajo, da je Platforma TomiTalk namenjena podpori govorno-jezikovnemu razvoju otrok in izobraževalni uporabi ter ne predstavlja zdravstvene, diagnostične ali terapevtske storitve v smislu veljavne zakonodaje.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. VSEBINA PLATFORME</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nosilec platforme si prizadeva Uporabnikom zagotoviti kakovostne, strokovno zasnovane in vsebinsko ustrezne digitalne vsebine, namenjene podpori govorno-jezikovnemu razvoju otrok, vključno z interaktivnimi vajami, igrami, testi, gradivi, informacijami ter drugimi funkcionalnostmi Platforme TomiTalk.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Kljub prizadevanjem Nosilec platforme ne prevzema nobene odgovornosti glede točnosti, popolnosti, zanesljivosti ali ažurnosti informacij, vsebin, rezultatov ali podatkov, ki jih Uporabniki pridobijo ali prejmejo z uporabo Platforme, ustvarjenimi ali obdelanimi s pomočjo avtomatiziranih sistemov, umetne inteligence, analize govora ali drugih tehnoloških rešitev, ter na povezavah oziroma povezanih drugih spletnih straneh.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Nosilec platforme ne jamči, da bodo vse vsebine, vaje, priporočila, rezultati testov ali poročila ustrezali pričakovanjem, potrebam ali specifičnim okoliščinam posameznega Uporabnika ali Otroka, niti da bodo dosegli določene učne, razvojne ali druge rezultate.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Odgovornost Nosilca platforme za kakršnekoli neprijetnosti, posledice ali škodo, ki bi Uporabniku, Naročniku ali Otroku nastala zaradi uporabe morebitnih napačnih, pomanjkljivih, nepopolnih ali kakorkoli drugače neustreznih vsebin, podatkov, informacij ali storitev, dostopnih na Platformi TomiTalk, je v celoti izključena, razen v obsegu, ki ga izrecno določa veljavna zakonodaja.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Uporabniki se z uporabo Platforme izrecno strinjajo in soglašajo, da vse vsebine, informacije, vaje, igre, testi in drugi elementi Platforme uporabljajo na lastno odgovornost.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. SPLETNI PROGRAM TOMITALK</h2>
            <p className="text-muted-foreground leading-relaxed">
              Registriranim uporabnikom je na Platformi TomiTalk omogočen dostop do spletnega programa TomiTalk, ki omogoča uporabo digitalnih vsebin, vaj, iger, testov in drugih funkcionalnosti, namenjenih podpori govorno-jezikovnemu razvoju otrok, pri čemer lahko posamezne funkcionalnosti temeljijo tudi na uporabi umetne inteligence, avtomatizirane obdelave govora ali drugih tehnoloških rešitev.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Delovanje spletnega programa TomiTalk, vključno z generiranjem vsebin, analizami, povratnimi informacijami, priporočili ali rezultati, lahko temelji na uporabi umetne inteligence ali drugih avtomatiziranih sistemov. Nosilec platforme ne nosi nobene odgovornosti za točnost, popolnost ali primernost vsebin, rezultatov ali informacij, ki jih spletni program TomiTalk poda Uporabniku ali Otroku, in je v celoti ekskulpiran za kakršnekoli neprijetnosti, posledice ali škodo, ki bi nastala zaradi morebitnih napačnih, pomanjkljivih ali kakorkoli drugače neustreznih podatkov, rezultatov ali priporočil, ustvarjenih s strani spletnega programa TomiTalk.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Uporabnik z uporabo spletnega programa TomiTalk izrecno priznava in razume, da spletni program služi izključno kot podporno in izobraževalno digitalno orodje za domačo uporabo ter ne predstavlja zdravstvene, diagnostične, terapevtske ali druge strokovne storitve v smislu veljavne zakonodaje. Uporabnik dodatno razume in priznava, da je kakovost, relevantnost in uporabnost rezultatov, povratnih informacij ali priporočil, ki jih poda spletni program TomiTalk, v veliki meri odvisna od načina uporabe Platforme, vnesenih podatkov, izvedbe vaj ter sodelovanja Otroka in Uporabnika.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              S sklenitvijo mesečne, letne ali druge oblike naročnine ima Uporabnik pravico do uporabe funkcionalnosti spletnega programa TomiTalk v obsegu, določenem z izbranim naročniškim paketom, kot je opredeljen v veljavnem Ceniku. Obseg uporabe posameznih funkcionalnosti (npr. število testov, analiz, poročil, shranjenih posnetkov ali drugih vsebin) je lahko omejen glede na izbrani naročniški paket.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Nosilec platforme si pridržuje pravico, da Uporabniku omogoči dostop do spletnega programa TomiTalk v roku do štiriindvajset (24) ur po uspešni registraciji ali sklenitvi naročniškega razmerja.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Nosilec platforme si pridržuje pravico, da kadarkoli začasno ali trajno omeji ali onemogoči Uporabniku dostop do posameznih funkcionalnosti spletnega programa TomiTalk, v primeru suma zlorabe Platforme, prekomerne ali neprimerne uporabe, kršitve teh Splošnih pogojev ali ravnanja, ki bi lahko povzročilo tehnično, pravno ali drugo škodo Nosilcu platforme ali tretjim osebam.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-foreground mb-4">5.1 Poročila TomiTalk</h3>
            <p className="text-muted-foreground leading-relaxed">
              Poročila TomiTalk so funkcionalnost v okviru Platforme TomiTalk, ki Uporabniku omogoča vpogled v otrokovo uporabo Platforme, opravljene aktivnosti ter rezultate določenih testov in vaj. Poročila se lahko generirajo samodejno ali polavtomatsko na podlagi uporabe Platforme, vnesenih podatkov in/ali uporabe umetne inteligence.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Platforma TomiTalk lahko Uporabniku zagotavlja naslednje vrste poročil:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>Poročilo o prvem testu izgovorjave, ki se pripravi na podlagi začetnega testa izgovorjave in predstavlja izhodiščno oceno otrokovega govornega stanja ob začetku uporabe Platforme;</li>
              <li>Periodična poročila o izgovorjavi, ki se praviloma pripravljajo po vsakem naslednjem opravljenem testu izgovorjave, predvidoma v časovnih intervalih približno treh (3) mesecev, in omogočajo spremljanje napredka otroka skozi čas;</li>
              <li>Tedenska poročila o uporabi Platforme, ki vključujejo pregled iger, vaj in drugih aktivnosti, ki jih je otrok opravil v določenem obdobju, brez zagotovila o obsegu, kakovosti ali učinkovitosti opravljenih aktivnosti;</li>
              <li>Poročila na podlagi vnesenih govorno-jezikovnih težav, ki se generirajo, ko Uporabnik na Platformi vnese podatke o zaznanih govorno-jezikovnih izzivih otroka, in so namenjena pripravi predlaganega učnega oziroma vadbenega načrta.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Vsa poročila, ustvarjena v okviru Platforme TomiTalk, so informativne in podporne narave ter temeljijo na podatkih, ki jih v sistem vnese Uporabnik, na uporabi Platforme ter na avtomatizirani obdelavi podatkov, vključno z uporabo umetne inteligence. Nosilec platforme ne jamči za točnost, popolnost, primernost ali strokovno ustreznost poročil za posamezen primer.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Uporabnik se z uporabo poročil izrecno zaveda in soglaša, da poročila ne predstavljajo zdravstvene, diagnostične ali terapevtske ocene, mnenja ali priporočila v smislu veljavne zakonodaje, temveč služijo izključno kot pomoč pri spremljanju uporabe Platforme in otrokovega napredka znotraj digitalnega okolja TomiTalk.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Nosilec platforme ne odgovarja za kakršnokoli škodo, posledice ali neprijetnosti, ki bi nastale zaradi uporabe, razlage ali napačnega razumevanja poročil. Uporabnik v celoti prevzema odgovornost za način uporabe poročil in za vse odločitve, sprejete na njihovi podlagi.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              V primeru, da Uporabnik v okviru Platforme nalaga, vnaša ali posreduje lastne vsebine, podatke ali opise otrokovih težav, Uporabnik jamči, da ima za takšne podatke pravico razpolagati ter da z njihovo uporabo ne krši pravic tretjih oseb. Nosilec platforme ne odgovarja za morebitne kršitve pravic tretjih oseb, ki bi nastale zaradi vsebin ali podatkov, vnesenih s strani Uporabnika.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. KOMUNIKACIJSKO OMREŽJE IN OPREMA</h2>
            <p className="text-muted-foreground leading-relaxed">
              Uporabnik je dolžan za dostop do Platforme TomiTalk zagotoviti ustrezno računalniško ali drugo elektronsko napravo (npr. osebni računalnik, tablico ali pametni telefon) z ustrezno internetno povezavo ter z nameščenim in podprtim spletnim brskalnikom oziroma programsko opremo, ki omogoča nemoteno uporabo Platforme.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Nosilec platforme Uporabnikom priporoča, da za učinkovito, varno in nemoteno uporabo Platforme TomiTalk uporabljajo posodobljeno programsko opremo, redno nameščajo varnostne in druge posodobitve operacijskih sistemov in brskalnikov ter uporabljajo ustrezno komunikacijsko in zaščitno opremo, ki upošteva veljavne varnostne standarde.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. VAROVANJE OSEBNIH PODATKOV</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nosilec platforme ne prevzema nobene odgovornosti za morebitne neprijetnosti, omejitve ali škodo, ki bi Uporabniku ali Naročniku nastale zaradi težav pri dostopu do Platforme TomiTalk ali pri njeni uporabi, kadar te težave izvirajo iz neustrezne, nezdružljive ali nepravilno uporabljene opreme na strani Uporabnika ali iz neustreznega načina uporabe takšne opreme.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Nosilec platforme se zavezuje k varovanju osebnih podatkov Uporabnikov v skladu z veljavno zakonodajo. Osebni podatki se ne posredujejo nepooblaščenim osebam.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Nosilec platforme lahko za zagotavljanje delovanja Platforme in izvajanje Storitev uporablja pogodbene obdelovalce osebnih podatkov (tretje osebe), ki osebne podatke obdelujejo izključno v imenu in po navodilih Nosilca platforme ter v skladu z veljavno zakonodajo.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Za varnost osebnih podatkov je delno odgovoren tudi Uporabnik, ki je dolžan varovati svoje uporabniško ime in geslo ter preprečiti nepooblaščen dostop do svojega uporabniškega računa.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Več informacij o varstvu osebnih podatkov je na voljo v dokumentu Politika zasebnosti.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. UPORABA PLATFORME</h2>
            
            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">8.1 Brezplačni uporabnik Platforme</h3>
            <p className="text-muted-foreground leading-relaxed">
              Brezplačni registrirani uporabnik Platforme TomiTalk ima dostop do omejenega obsega funkcionalnosti Platforme. Obseg brezplačne uporabe je količinsko omejen in je določen na Platformi (npr. omejeno število interakcij, testov, vaj ali drugih funkcionalnosti v posameznem časovnem obdobju).
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Nosilec platforme si pridržuje pravico, da obseg brezplačne uporabe kadarkoli spremeni.
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">8.2 Registriran uporabnik</h3>
            <p className="text-muted-foreground leading-relaxed">
              Registriran uporabnik Platforme TomiTalk je lahko zgolj uporabnik, ki ima z Nosilcem platforme sklenjeno naročniško razmerje, razen če je izrecno določeno drugače.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Registriran uporabnik je dolžan v postopku registracije vnesti pravilne in resnične podatke o elektronskem naslovu ter druge osebne podatke, ki se nanašajo nanj in jih zahteva postopek registracije. Ob vnosu zahtevanih podatkov Registriran uporabnik prejme dostopne podatke oziroma enkratno geslo za vstop na vnesen elektronski naslov. Šteje se, da se je Uporabnik z uspešno registracijo seznanil s temi Splošnimi pogoji in da se z njimi strinja.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Po potrditvi in vnosu vseh zahtevanih podatkov Uporabnik pridobi status Registriranega uporabnika.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Registriran uporabnik je dolžan svoj elektronski naslov in dostopne podatke hraniti kot poslovno skrivnost. Posredovanje dostopnih podatkov tretjim osebam ali njihova uporaba v nasprotju s temi Splošnimi pogoji ni dovoljena.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              V primeru, da Nosilec platforme ugotovi zlorabo, kršitev teh Splošnih pogojev ali nepooblaščeno uporabo uporabniškega računa, si pridržuje pravico, da uporabniku nemudoma in brez predhodnega obvestila onemogoči dostop do Platforme.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Uporabniški račun lahko ostane aktiven v sistemu Nosilca platforme še šest (6) mesecev od zadnje prijave na Platformo, skladno z internimi pravili hrambe podatkov.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Registriran uporabnik s plačilom mesečne ali letne naročnine pridobi pravico do uporabe plačljivih vsebin in funkcionalnosti Platforme TomiTalk, kot so opredeljene v izbranem naročniškem paketu.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              V primeru, da Registriran uporabnik ne želi več prejemati obvestil ali biti registriran, se mora odjaviti tako, da poda zahtevo na elektronski naslov: <a href="mailto:info@tomitalk.si" className="text-dragon-green hover:underline">info@tomitalk.si</a>
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">8.3 Neregistriran uporabnik</h3>
            <p className="text-muted-foreground leading-relaxed">
              Neregistriran uporabnik je oseba, ki anonimno in brez registracije dostopa do odprtega, javno dostopnega dela Platforme TomiTalk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. NAROČNIŠKO RAZMERJE</h2>
            
            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">9.1 Sklenitev naročniškega razmerja</h3>
            <p className="text-muted-foreground leading-relaxed">
              Naročniško razmerje za uporabo Platforme TomiTalk se sklene med Naročnikom in Nosilcem platforme TomiTalk.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Naročniško razmerje se šteje za sklenjeno z uspešno izvedeno registracijo in potrditvijo naročniškega paketa oziroma s plačilom naročnine, v skladu s postopkom, določenim na Platformi.
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">9.2 Naročniški paketi in naročniške storitve</h3>
            <p className="text-muted-foreground leading-relaxed">
              Platforma TomiTalk omogoča sklenitev naročniškega razmerja na mesečni ali letni ravni.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Podrobnejše informacije o posameznih naročniških paketih, obsegu storitev, funkcionalnostih ter morebitnih omejitvah so objavljene na Platformi TomiTalk. Ponudba storitev se lahko sproti dopolnjuje, nadgrajuje ali spreminja. Informativni cenik naročniških paketov in dodatnih storitev je objavljen na spletni strani Platforme.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Nosilec platforme si pridržuje pravico, da Naročniku v okviru naročniškega razmerja ponudi posebne ugodnosti, promocije ali druge pogoje, katerih vrsta, obseg in čas trajanja se lahko določijo v okviru naročniškega paketa ali posebnega dogovora.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Poleg osnovnih naročniških paketov lahko Naročnik po lastni izbiri sklene tudi dodatno naročniško storitev TomiTalk Plus.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Storitev TomiTalk Plus vključuje:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-2">
              <li>izvedbo testa izgovorjave, strokovno obravnavo testa izgovorjave s strani logopeda, praviloma ob začetku uporabe storitve in nato periodično, predvidoma v približno trimesečnih časovnih intervalih,</li>
              <li>pripravo strokovnih poročil, pripravo prilagojenega osebnega vadbenega oziroma učnega načrta za hitrejše doseganje rezultatov,</li>
              <li>poročila o napredku ter grafični prikaz napredka.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Natančen obseg, pogostost izvajanja posameznih storitev ter vsebina storitve TomiTalk Plus so podrobneje opredeljeni na Platformi TomiTalk in so lahko odvisni od izbranega naročniškega paketa. Nosilec platforme si pridržuje pravico do spremembe ali nadgradnje vsebine storitve TomiTalk Plus.
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">9.3 Prenehanje naročniškega razmerja</h3>
            <p className="text-muted-foreground leading-relaxed">
              Naročniško razmerje se sklene za obdobje enega (1) meseca ali enega (1) leta in se po poteku izbranega obdobja avtomatično podaljša, razen če Naročnik naročnino pravočasno odpove.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Odjava naročniškega razmerja je mogoča preko nastavitev uporabniškega profila oziroma na način, določen na Platformi TomiTalk. Po odjavi ostane Platforma Naročniku dostopna še do izteka tekočega naročniškega obdobja, za katerega je bila naročnina že plačana.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Vračilo že plačanih sredstev se lahko uredi izključno v primeru, da Naročnik v preostalem času po odjavi storitev Platforme TomiTalk ne uporablja, in po poteku obdobja, za katerega je imel še omogočen dostop, skladno s pogoji, določenimi na Platformi.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Nosilec platforme si pridržuje pravico, da iz poslovnih, tehničnih ali drugih utemeljenih razlogov preneha vzdrževati Platformo TomiTalk in preneha z nudenjem storitev Uporabnikom. V takem primeru lahko Nosilec platforme enostransko prekine naročniško razmerje, pri čemer je dolžan Naročnika o tem obvestiti.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              V obvestilu o prenehanju delovanja Platforme mora Nosilec platforme Naročniku posredovati datum prenehanja delovanja Platforme, ki hkrati pomeni tudi datum prenehanja naročniškega razmerja ter vseh medsebojnih pravic in obveznosti, ki izhajajo iz naročniške pogodbe.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. NAROČNINA IN PRIPOROČILNI PROGRAM</h2>
            
            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">10.1 Nadomestila in izplačila</h3>
            <p className="text-muted-foreground leading-relaxed">
              Nekatere storitve Platforme TomiTalk so plačljive in se obračunavajo v skladu z vsakokratno veljavnim cenikom, objavljenim na Platformi.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Nosilec platforme si pridržuje pravico, da določi, katere storitve so plačljive, kakšna je njihova cena ter pod kakšnimi pogoji se storitve obračunavajo, pri čemer so vse relevantne informacije pred sklenitvijo naročniškega razmerja jasno predstavljene na Platformi TomiTalk.
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">10.2 Naročnina paketov</h3>
            <p className="text-muted-foreground leading-relaxed">
              Cena naročnine za posamezni naročniški paket ali dodatno naročniško storitev je določena z veljavnim cenikom, objavljenim na Platformi TomiTalk.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Naročnina se praviloma plačuje mesečno ali letno, v skladu z izbranim naročniškim paketom. Prva naročnina se plača ob sklenitvi naročniškega razmerja.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Plačilo naročnine se izvede preko spletnega plačilnega sistema stripe.com, v skladu s pogoji ponudnika plačilnih storitev.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Računi za vse storitve, ki jih Nosilec platforme obračunava Naročniku na podlagi naročniškega razmerja, kot tudi morebitni opomini za plačilo, se Naročniku posredujejo v elektronski obliki na elektronski naslov, naveden ob registraciji.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Naročnik je dolžan Nosilca platforme nemudoma obvestiti o morebitnih spremembah elektronskega naslova, sedeža ali drugih podatkov, ki so pomembni za pravilno izvajanje naročniškega razmerja.
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">10.3 Priporočilni program</h3>
            <p className="text-muted-foreground leading-relaxed">
              Podrobnosti priporočilnega programa so na voljo v okviru uporabniškega profila na Platformi TomiTalk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">11. OMEJITEV ODGOVORNOSTI NOSILCA PLATFORME</h2>
            <p className="text-muted-foreground leading-relaxed">
              Storitve Platforme TomiTalk so Uporabnikom na voljo »takšne, kot so«. Nosilec platforme ne daje nobenih jamstev, pogojev ali zagotovil, izrecnih ali implicitnih, v zvezi s katerokoli zadevo, vključno z (vendar ne omejeno na) delovanje Platforme, rezultate uporabe, varnost, ne kršenje pravic, združljivost, nemoteno uporabo, funkcionalnosti, pričakovanja, zadovoljivo kakovost ali primernost Platforme za kakršen koli poseben namen.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Nosilec platforme ne jamči, da:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-2">
              <li>bo delovanje Platforme TomiTalk nemoteno ali brez napak;</li>
              <li>bo v primeru morebitnih napak vse napake odpravil v najkrajšem možnem času;</li>
              <li>bo Platforma TomiTalk v celoti zadostila potrebam, pričakovanjem ali zahtevam Uporabnikov ali delovala z vso strojno ali programsko opremo, razen s tisto, ki jo izrecno navede Nosilec platforme.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Nosilec platforme ne jamči za delovanje Platforme TomiTalk v primeru uporabe ali integracije s produkti, storitvami ali sistemi tretjih oseb. Nosilec platforme ne daje nobenih dodatnih zagotovil ali jamstev glede Platforme TomiTalk, vključno z izrecnimi ali implicitnimi jamstvi glede ustrezne kakovosti, primernosti za prodajo, primernosti za določen namen ter nekršitve pravic tretjih oseb.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              V obsegu, ki ga dovoljuje veljavna zakonodaja, Nosilec platforme izključuje odgovornost za kakršnokoli neposredno, posredno, naključno, posebno ali posledično škodo, ki bi nastala zaradi uporabe ali nezmožnosti uporabe Platforme TomiTalk, tudi v primeru, če je bil Uporabnik obveščen o možnosti nastanka takšne škode.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Nosilec platforme ne odgovarja za kakršenkoli neuspeh ali zamudo pri zagotavljanju Storitev ter ne prevzema odgovornosti za pogodbeno ali ne pogodbeno škodo, ki izhaja iz ali je kakorkoli povezana z uporabo Platforme ali s temi Splošnimi pogoji.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Nosilec platforme prav tako ne odgovarja za izgubo poslov, izgubo dobička, prekinitev poslovanja, izgubo podatkov, izgubo poslovnih informacij ali kakršnokoli drugo gospodarsko ali premoženjsko izgubo.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Nosilec platforme ne odgovarja za rezultate, povratne informacije, priporočila ali vsebine, ki jih zagotavlja spletni program TomiTalk in druge avtomatizirane funkcionalnosti Platforme, vključno s funkcionalnostmi, ki temeljijo na umetni inteligenci. Platforma TomiTalk je namenjena podpori govorno-jezikovnemu razvoju otrok in izobraževalni uporabi ter ne predstavlja zdravstvene, diagnostične ali terapevtske storitve v smislu veljavne zakonodaje.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">12. JAMSTVO ZA SKLADNOST DIGITALNE VSEBINE ALI DIGITALNE STORITVE</h2>
            <p className="text-muted-foreground leading-relaxed">
              Ker so predmet naročniškega razmerja digitalna vsebina in/ali digitalne storitve, Nosilec platforme odgovarja za skladnost digitalne vsebine ali digitalne storitve v skladu s členi 109 do 120 Zakona o varstvu potrošnikov (ZVPot-1).
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              V primeru enkratne dobave ali niza posameznih dobav digitalne vsebine ali digitalne storitve Nosilec platforme odgovarja za neskladnost, ki obstaja ob dobavi in se pokaže v dveh (2) letih od dobave digitalne vsebine ali digitalne storitve. V primeru nepretrgane dobave digitalne vsebine ali digitalne storitve v določenem obdobju Nosilec platforme odgovarja za neskladnost, ki nastane ali se pokaže v obdobju, v katerem mora biti digitalna vsebina ali digitalna storitev dobavljena v skladu s pogodbo.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              V primeru neskladnosti digitalne vsebine ali digitalne storitve lahko Naročnik, pod pogoji, določenimi v ZVPot-1, uveljavlja naslednje pravice:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-2">
              <li>zahteva vzpostavitev skladnosti digitalne vsebine ali digitalne storitve,</li>
              <li>zahteva sorazmerno znižanje kupnine ali</li>
              <li>odstopi od pogodbe o dobavi digitalne vsebine ali digitalne storitve.</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">a) Zahteva za vzpostavitev skladnosti digitalne vsebine ali digitalne storitve</h3>
            <p className="text-muted-foreground leading-relaxed">
              Nosilec platforme bo vzpostavil skladnost digitalne vsebine ali digitalne storitve, razen če bi bilo to nemogoče ali bi Nosilcu platforme povzročilo nesorazmerne stroške, pri čemer se upoštevajo vse okoliščine posameznega primera, zlasti vrednost digitalne vsebine ali digitalne storitve, če bi bila skladna, ter pomen ugotovljene neskladnosti.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Skladnost se vzpostavi v razumnem roku od trenutka, ko Naročnik obvesti Nosilca platforme o neskladnosti, brezplačno in brez znatnih nevšečnosti za Naročnika, ob upoštevanju vrste digitalne vsebine ali digitalne storitve ter namena, za katerega je Naročnik to digitalno vsebino ali storitev potreboval.
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">b) Znižanje kupnine</h3>
            <p className="text-muted-foreground leading-relaxed">
              Naročnik lahko zahteva sorazmerno znižanje kupnine, kadar je digitalna vsebina ali digitalna storitev dobavljena proti plačilu, ali odstopi od pogodbe o dobavi digitalne vsebine ali digitalne storitve v kateremkoli od naslednjih primerov:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-2">
              <li>vzpostavitev skladnosti digitalne vsebine ali digitalne storitve ni mogoča ali bi bila nesorazmerna;</li>
              <li>Nosilec platforme ni vzpostavil skladnosti digitalne vsebine ali digitalne storitve;</li>
              <li>digitalna vsebina ali digitalna storitev ostaja neskladna kljub poskusu Nosilca platforme, da bi vzpostavil skladnost;</li>
              <li>narava neskladnosti digitalne vsebine ali digitalne storitve je tako resna, da upravičuje takojšnje sorazmerno znižanje kupnine ali odstop od pogodbe;</li>
              <li>Nosilec platforme je izjavil ali je iz okoliščin očitno, da skladnosti ne bo vzpostavil v razumnem roku ali brez znatnih nevšečnosti za Naročnika.</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">c) Odstop od pogodbe</h3>
            <p className="text-muted-foreground leading-relaxed">
              Naročnik nima pravice do odstopa od pogodbe o dobavi digitalne vsebine ali digitalne storitve, ki je dobavljena proti plačilu, če je ugotovljena neskladnost zgolj neznatna. Dokazno breme, da gre za neznatno neskladnost digitalne vsebine ali digitalne storitve, nosi Nosilec platforme.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">13. ODSTOP OD POGODBE</h2>
            <p className="text-muted-foreground leading-relaxed">
              Naročnik lahko takoj odstopi od pogodbe o dobavi digitalne vsebine ali digitalne storitve, sklenjene na daljavo:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-2">
              <li>če Nosilec platforme izjavi ali je iz okoliščin očitno, da Nosilec platforme digitalne vsebine ali digitalne storitve ne bo dobavil;</li>
              <li>če je Naročnik pred sklenitvijo pogodbe o dobavi digitalne vsebine ali digitalne storitve Nosilca platforme izrecno seznanil, da je čas dobave bistven za Naročnika, Nosilec platforme pa Naročniku ne omogoči dostopa do digitalne vsebine ali digitalne storitve v dogovorjenem roku.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Naročnik uveljavi pravico do odstopa od pogodbe z izjavo, s katero obvesti Nosilca platforme, da odstopa od pogodbe o dobavi digitalne vsebine ali digitalne storitve. V primeru odstopa ima Naročnik pravice, določene z veljavno zakonodajo.
            </p>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Nepretrgana dobava digitalne vsebine ali digitalne storitve:</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>V primeru, da je s pogodbo o dobavi digitalne vsebine ali digitalne storitve dogovorjena nepretrgana dobava v določenem obdobju, bo Nosilec platforme zagotavljal dostop do dogovorjenih digitalnih vsebin ali storitev skozi celotno dogovorjeno obdobje.</li>
              <li>Nosilec platforme ne odgovarja za nezagotavljanje ali moteno zagotavljanje digitalne vsebine ali digitalne storitve v primeru izpada elektronskega komunikacijskega omrežja, izpada električne energije, tehničnih motenj, napak tretjih oseb ali v primeru višje sile.</li>
              <li>Nosilec platforme si pridržuje pravico do začasne prekinitve zagotavljanja digitalne vsebine ali digitalne storitve zaradi vzdrževanja Platforme, nadgradenj ali zamenjave programske opreme. V takšnih primerih bo Nosilec platforme, kadar je to mogoče, Naročnika vnaprej obvestil o razlogu in predvidenem trajanju začasne prekinitve. Nosilec platforme si bo v vsakem primeru prizadeval, da bo prekinitev trajala čim krajši čas. V primeru začasne prekinitve pod pogoji iz te določbe Naročnik nima nobenih dodatnih zahtevkov do Nosilca platforme.</li>
            </ul>

            <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Pravica do odstopa od pogodbe:</h3>
            <p className="text-muted-foreground leading-relaxed">
              Naročnik ima pravico, da v roku štirinajstih (14) dni od sklenitve pogodbe o dobavi digitalne vsebine ali digitalne storitve odstopi od pogodbe, ne da bi mu bilo treba navesti razlog za svojo odločitev, razen v primerih, določenih z veljavno zakonodajo.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Naročnik nima pravice do odstopa od pogodbe v primeru digitalnih vsebin ali storitev, ki so personalizirane ali izdelane posebej za Naročnika, vključno s storitvami, ki vključujejo individualno prilagojene vsebine, poročila, strokovne obravnave ali prilagojene načrte.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Prav tako Naročnik nima pravice do odstopa od pogodbe o dobavi digitalne vsebine ali digitalne storitve, če se je izvajanje pogodbe začelo z njegovim izrecnim predhodnim soglasjem in privolitvijo, da s tem izgubi pravico do odstopa od pogodbe, ko je Nosilec platforme pogodbo v celoti izpolnil.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Naročnik uveljavi pravico do odstopa od pogodbe tako, da Nosilcu platforme poda nedvoumno izjavo, iz katere jasno izhaja, da odstopa od pogodbe. V ta namen lahko Naročnik uporabi obrazec za odstop od pogodbe ali poda izjavo po elektronski pošti ali po pošti. Šteje se, da je Naročnik pravočasno obvestil Nosilca platforme, če izjavo o odstopu pošlje v zakonsko določenem roku.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">14. VARSTVO AVTORSKIH PRAVIC IN INTELEKTUALNE LASTNINE</h2>
            <p className="text-muted-foreground leading-relaxed">
              Izvorna koda Platforme TomiTalk, vsa vsebina Platforme, vključno (vendar ne omejeno) z logotipi, imenom, slikami, besedili, grafičnimi elementi, ilustracijami, videi, zvočnimi posnetki, poročili, strukturami podatkov, dizajnom ter drugo intelektualno lastnino, je izključna last Nosilca platforme ali njegovih pogodbenih partnerjev ter je varovana v skladu z veljavno zakonodajo s področja avtorskega prava in pravic industrijske lastnine.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Z uporabo, namestitvijo ali dostopom do Platforme TomiTalk Uporabnik pridobi zgolj neizključno, neprenosljivo, časovno omejeno in preklicno pravico do uporabe Platforme in njenih vsebin, izključno za osebno in nekomercialno uporabo ter v skladu s temi Splošnimi pogoji.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Platforma TomiTalk je v lasti Nosilca platforme. Uporabnik z uporabo Platforme ne pridobi nobenih drugih pravic intelektualne lastnine ali drugih pravic na Platformi ali njenih vsebinah, razen tistih, ki so izrecno določene v teh Splošnih pogojih.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Brez izrecnega predhodnega pisnega soglasja Nosilca platforme Uporabnik ne sme:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-2">
              <li>izdelovati kopij Platforme ali njenih delov, izvajati povratnega inženiringa, dekompilacije ali razgradnje programske kode,</li>
              <li>spreminjati, prilagajati ali kakorkoli posegati v Platformo,</li>
              <li>dajati Platforme ali njenih delov v zakup, najem ali uporabo tretjim osebam,</li>
              <li>podeljevati podlicenc ali kakorkoli prenašati pravic uporabe na tretje osebe.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Vsaka uporaba Platforme ali njenih vsebin, ki ni izrecno dovoljena s temi Splošnimi pogoji ali z veljavno zakonodajo, predstavlja kršitev pravic intelektualne lastnine in lahko vodi do ustreznih pravnih posledic.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">15. KONČNE DOLOČBE</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nosilec platforme si pridržuje pravico, da ponudbo Storitev kadarkoli spremeni, začasno omeji ali v celoti prekine ter da kadarkoli omeji ali onemogoči dostop do Platforme TomiTalk, tudi v primeru, ko Nosilec platforme presodi, da Uporabnik krši te Splošne pogoje.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Nosilec platforme si pridržuje pravico, da te Splošne pogoje kadarkoli spremeni, dopolni ali nadomesti, delno ali v celoti, ne glede na razlog in brez predhodnega obvestila.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Nosilec platforme ima pravico, da določbe Splošnih pogojev občasno spremeni tako, da odražajo spremembe v ponujenih Storitvah, načinu poslovanja ali veljavni zakonodaji. Spremenjeni Splošni pogoji bodo objavljeni na Platformi TomiTalk.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Spremenjeni Splošni pogoji začnejo veljati z dnem njihove objave na Platformi TomiTalk. Uporabnikom se priporoča, da ob vsaki uporabi Platforme preverijo veljavne Splošne pogoje, da se seznanijo z morebitnimi spremembami.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Če se Uporabnik s spremembami Splošnih pogojev ne strinja, ima pravico prenehati uporabljati Platformo in Storitve. Nadaljnja uporaba Platforme TomiTalk po objavi spremenjenih Splošnih pogojev se šteje kot sprejem teh sprememb.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Ti Splošni pogoji so objavljeni na Platformi TomiTalk in začnejo veljati z dnem objave.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Za presojo in razlago teh Splošnih pogojev ter za pravice in obveznosti pogodbenih strank, ki izhajajo iz ali so povezane s temi Splošnimi pogoji, se uporablja pravo Republike Slovenije, ob izključitvi kolizijskih pravil.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              V primeru morebitnega spora v zvezi s temi Splošnimi pogoji ali uporabo Platforme TomiTalk, ki ga ni mogoče rešiti sporazumno, je za odločanje izključno pristojno stvarno pristojno sodišče v Trebnjem.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Za splošno podporo in vprašanja v zvezi s Platformo TomiTalk se lahko obrnete na Nosilca platforme preko elektronskega naslova: <a href="mailto:info@tomitalk.si" className="text-dragon-green hover:underline">info@tomitalk.si</a>
            </p>
            <p className="text-muted-foreground leading-relaxed mt-6 text-sm italic">
              Zadnja sprememba: 2.1.2026
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SplosniPogoji;
