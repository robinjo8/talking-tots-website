import Header from "@/components/Header";


const KakoDeluje = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
        <h1 className="text-3xl font-bold text-dragon-green mb-8">
          Navodila za uporabo
        </h1>
        
        <div className="prose prose-slate max-w-none space-y-8 text-justify">
          
          {/* 1. Uvod */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              1. Kaj je TomiTalk in komu je namenjen
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              TomiTalk je slovenska digitalna aplikacija, razvita v sodelovanju z logopedi, namenjena otrokom od 3 do 10 let za podporo razvoju govora.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Namen aplikacije je:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>omogočiti dodatno govorno vadbo doma,</li>
              <li>podpreti otroka na zabaven in motivacijski način,</li>
              <li>simulirati elemente logopedske obravnave v digitalni obliki.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              TomiTalk ne nadomešča dela logopeda, temveč deluje kot dopolnilo strokovni terapiji. Namenjena je zapolnjevanju vrzeli:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>med posameznimi logopedskimi obiski,</li>
              <li>v času čakanja na obravnavo,</li>
              <li>za redno in pogostejšo vadbo govora doma.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Aplikacija staršem omogoča tudi sprotno spremljanje napredka in boljši vpogled v otrokove govorne izzive.
            </p>
          </section>

          {/* 2. Dodajanje otroškega profila */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              2. Dodajanje otroškega profila in funkcija »Moj osebni načrt«
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              TomiTalk omogoča ustvarjanje osebnega profila za vsakega otroka, kar je osnovni pogoj za uporabo aplikacije.
            </p>
            
            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Dodajanje otroka v profil</h4>
            <p className="text-muted-foreground leading-relaxed">
              Po izbiri naročniškega paketa mora uporabnik v svojem uporabniškem profilu obvezno dodati otroka. Brez dodanega otroškega profila aplikacija ne more delovati.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Pri dodajanju otroka uporabnik vnese:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>otrokovo starost,</li>
              <li>izbrane govorne težave in</li>
              <li>izpolni osnovni vprašalnik.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Pravilno in natančno izpolnjeni podatki so ključni, saj omogočajo, da aplikacija:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>prilagodi igre in vaje otrokovi starosti,</li>
              <li>izbere ustrezno težavnost vaj,</li>
              <li>ponudi vsebine, ki so razvojno primerne in učinkovite.</li>
            </ul>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Spremljanje napredka</h4>
            <p className="text-muted-foreground leading-relaxed">
              Otroški profil beleži:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>opravljene vaje in izzive,</li>
              <li>napredek otroka skozi čas (funkcija spremljanja napredka je na voljo v naročnini TomiTalk Pro).</li>
            </ul>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Moj osebni načrt (TomiTalk Pro)</h4>
            <p className="text-muted-foreground leading-relaxed">
              V okviru naročnine TomiTalk Pro aplikacija pripravi osebni program z imenom »Moj osebni načrt«.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Ta načrt:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>temelji na strokovnem logopedskem poročilu in umetni inteligenci,</li>
              <li>vključuje prilagojene vaje in igre za posameznega otroka,</li>
              <li>se sproti prilagaja glede na otrokove govorne težave in napredek.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong>Primer:</strong> če ima otrok težave z izgovorjavo glasov »š« in »ž«, bo aplikacija prednostno ponujala igre in vaje za ta glasova.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              »Moj osebni načrt« deluje podobno kot individualni terapevtski načrt logopeda – vsak otrok ima svoj prilagojen program, kar:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>povečuje motivacijo,</li>
              <li>izboljšuje učinkovitost vaj,</li>
              <li>omogoča jasen pregled nad potekom vadbe.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Starši lahko v otrokovem profilu spremljajo:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>katere izzive je otrok že osvojil,</li>
              <li>kateri izzivi ga še čakajo,</li>
              <li>kako poteka njegov osebni načrt.</li>
            </ul>
          </section>

          {/* 3. Stran »Govor« */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              3. Stran »Govor«
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Stran Govor je osrednje mesto v aplikaciji TomiTalk, kjer ima uporabnik dostop do vseh glavnih vsebinskih sklopov, prilagojenih izbranemu otroškemu profilu.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Na tej strani se nahajajo naslednji razdelki:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li><strong>Moj osebni načrt</strong> – Pregled personaliziranega programa vaj in iger, pripravljenega glede na otrokovo starost in govorne težave (na voljo v naročnini TomiTalk Pro).</li>
              <li><strong>Govorne igre</strong> – Interaktivne igre za utrjevanje pravilne izgovorjave glasov in besed skozi igro.</li>
              <li><strong>Govorne vaje</strong> – Strukturirane vaje za ciljno vadbo posameznih glasov in govornih spretnosti.</li>
              <li><strong>Preverjanje izgovorjave</strong> – Funkcija za preverjanje otrokove izgovorjave in spremljanje napredka.</li>
              <li><strong>Video navodila</strong> – Kratki strokovni videi z razlago pravilne izvedbe vaj in izgovorjave glasov.</li>
              <li><strong>Logopedski nasveti</strong> – Strokovni nasveti in usmeritve za starše, ki podpirajo govorni razvoj otroka doma.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Vse vsebine na strani Govor se samodejno prilagajajo izbranemu otroškemu profilu, kar omogoča ciljno, varno in razvojno ustrezno uporabo aplikacije.
            </p>
          </section>

          {/* 4. Govorne igre */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              4. Govorne igre
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Osrednja prednost aplikacije TomiTalk je, da učenje poteka skozi igro. Govorne igre so zasnovane kot interaktivne dejavnosti, s katerimi otrok na naraven in zabaven način utrjuje pravilno izgovorjavo glasov in besed.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Aplikacija vključuje več vrst govornih iger, prilagojenih logopedskim ciljem. Na voljo so različice igre za glasove: C, Č, R, L, K, S, Š, Z in Ž (skupno 9 različic).
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Igra »Spomin«</h4>
            <p className="text-muted-foreground leading-relaxed">
              Klasična igra iskanja parov kart, prilagojena za logopedsko vadbo. Otrok obrača kartice s sličicami in ob tem poimenuje prikazane slike, s čimer vadi ciljni glas v različnih besedah.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Na voljo so različice igre za glasove: C, Č, R, L, K, S, Š, Z in Ž (skupno 9 različic).
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Sestavljanke</h4>
            <p className="text-muted-foreground leading-relaxed">
              Otrok sestavlja klasične slike iz več delov. Vsaka sestavljanka prikazuje sliko, katere ime vsebuje ciljni glas (npr. riba za glas R).
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Ko je slika sestavljena, aplikacija otroka spodbudi, da glasno ponovi različne besede na ciljno črko, s čimer utrjuje pravilno izgovorjavo.
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Drsne sestavljanke</h4>
            <p className="text-muted-foreground leading-relaxed">
              Zahtevnejša različica sestavljank, kjer otrok z drsnim premikanjem koščkov sestavi celotno sliko. Težavnost je prilagojena otrokovi starosti (različne velikosti mrež).
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Igra krepi:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>vztrajnost,</li>
              <li>vizualno-motorične spretnosti,</li>
              <li>pravilno izgovorjavo različnih besed za ciljno črko ob zaključku igre.</li>
            </ul>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Igra ujemanja (»Poveži pare«)</h4>
            <p className="text-muted-foreground leading-relaxed">
              Otrok povezuje med seboj ujemajoče se elemente:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>slike,</li>
              <li>besede,</li>
              <li>sence slik,</li>
              <li>zvočne posnetke.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Težavnost se prilagaja starosti otroka.
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Igra zaporedja</h4>
            <p className="text-muted-foreground leading-relaxed">
              Otrok z uporabo funkcije »povleci in spusti« razporeja slike v pravilnem vrstnem redu. Ko je zaporedje pravilno sestavljeno, se igra zaključi in prikaže se pojavno okno z besedami za izgovorjavo.
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Labirint</h4>
            <p className="text-muted-foreground leading-relaxed">
              Otrok lik zmajčka premika v smeri gor, dol, levo in desno, po poti pobira zvezdice, kjer posamezna zvezdica predstavlja eno naključno izbrano besedo za ciljno črko. Ko otrok osvoji vse zvezdice se pot do cilja odpre. Na koncu, ko doseže cilj – ponovi vse besede še enkrat.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Igra razvija:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>orientacijo,</li>
              <li>logično razmišljanje,</li>
              <li>vztrajnost,</li>
              <li>sodelovanje pri govorni nalogi ob zaključku igre.</li>
            </ul>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Kolo besed</h4>
            <p className="text-muted-foreground leading-relaxed">
              Na zaslonu je prikazano kolo, razdeljeno na segmente, kjer vsak predstavlja eno besedo. Otrok klikne gumb »Zavrti«, kolo se zavrti in naključno izbere besedo.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Za osvojitev besede mora otrok:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>besedo pravilno izgovoriti 3-krat,</li>
              <li>nato prejme zvezdico kot nagrado.</li>
            </ul>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Bingo</h4>
            <p className="text-muted-foreground leading-relaxed">
              Igra naključno izbere sliko, otrok pa mora v mreži označiti vsa polja, kjer se ta slika pojavi.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Igra se zaključi, ko otrok:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>pravilno izgovori najmanj 8 besed in</li>
              <li>zaključi polno vrstico ali stolpec.</li>
            </ul>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Smešne povedi</h4>
            <p className="text-muted-foreground leading-relaxed">
              Otrok trikrat »meče kocko«:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>prvi met izbere osebek (bitje),</li>
              <li>drugi met izbere povedek,</li>
              <li>tretji met izbere predmet.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Iz treh delov se sestavi smešna poved, ki jo mora otrok na koncu ponoviti na glas, s čimer vadi tekočnost govora in povezovanje besed v poved.
            </p>
          </section>

          {/* 5. Zaključek govornih iger */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              5. Zaključek govornih iger – ponavljanje in nagrajevanje
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Po zaključku vsake govorne igre se vedno prikaže pojavno (pop-up) okno za ponavljanje.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              V tem oknu so prikazane:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>slike z besedami, ki jih mora otrok ponoviti (izgovoriti),</li>
              <li>pri nekaterih igrah več različnih slik,</li>
              <li>pri drugih ena slika, ki jo je treba ponoviti večkrat.</li>
            </ul>
          </section>

          {/* 6. Kako poteka ponavljanje */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              6. Kako poteka ponavljanje
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Otrok ponavljanje začne tako, da klikne na sliko. Ob kliku se sproži 3-sekundno odštevanje (3 → 2 → 1 → 0), po katerem se ponovitev šteje kot opravljena.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Ko je ponovitev izvedena:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>se element v oknu označi kot zaključen (npr. postane siv),</li>
              <li>slike ni več mogoče ponovno klikniti.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Če otrok pri izgovorjavi potrebuje pomoč, lahko pri vsaki besedi uporabi gumb za predvajanje pravilne izgovorjave (🔊).
            </p>
          </section>

          {/* 7. Zaključek in nagrada */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              7. Zaključek in nagrada
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Ko otrok opravi vse zahtevane ponovitve v pop-up oknu:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>se prikaže gumb »Vzemi zvezdico«,</li>
              <li>zvezdica se shrani na Moja stran pod otrokov profil.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              S klikom na gumb otrok:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>prejme nagrado (zvezdico),</li>
              <li>pop-up okno se zapre,</li>
              <li>uporaba aplikacije se lahko nemoteno nadaljuje.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Ta sistem ponavljanja in nagrajevanja spodbuja:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>redno izgovorjavo besed,</li>
              <li>vztrajnost pri vadbi,</li>
              <li>pozitivno motivacijo otroka skozi igro.</li>
            </ul>
          </section>

          {/* 8. Govorne vaje */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              8. Govorne vaje
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Poleg govornih iger aplikacija TomiTalk vključuje tudi sklop strukturiranih govornih vaj, ki so zasnovane po vzoru vaj, kakršne otrok izvaja pri logopedski obravnavi.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Govorne vaje so namenjene ciljni in sistematični vadbi pravilne izgovorjave ter zajemajo dve glavni področji.
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Vaje za motoriko govoril</h4>
            <p className="text-muted-foreground leading-relaxed">
              Vaje za motoriko govoril so usmerjene v gibljivost in koordinacijo govornih organov, predvsem:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>jezika,</li>
              <li>ustnic,</li>
              <li>čeljusti,</li>
              <li>mehkega neba.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Pri težavah z izgovorjavo glasov logopedi pogosto najprej preverijo, ali otrok zmore ustrezno premikanje govoril (npr. dvig jezika proti nebu pri glasovih L in R ali nadzor ustnic pri izgovorjavi samoglasnikov).
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              TomiTalk vsebuje posebno vadnico za motoriko govoril, kjer aplikacija otroka:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>vodi skozi vaje z animacijami,</li>
              <li>uporablja zvočna navodila,</li>
              <li>spodbuja otroka k posnemanju obraznih gibov in grimas.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Takšne vaje:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>krepijo mišice govoril,</li>
              <li>izboljšujejo koordinacijo,</li>
              <li>predstavljajo osnovo za pravilno izgovorjavo glasov.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Aplikacija tradicionalne »govorne telovadbe« predstavi na otroku prijazen in igriv način, kar poveča motivacijo za redno izvajanje vaj.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Pri vsaki vaji otrok:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>sliši pravilno izgovorjavo,</li>
              <li>vidi ustrezno sliko,</li>
              <li>nato vajo sam ponovi.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Podoben postopni pristop je uporabljen tudi pri drugih glasovih. Aplikacija z uporabo animiranih likov in jasnih navodil v slovenščini otroku razloži:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>kam postaviti jezik,</li>
              <li>kako oblikovati usta,</li>
              <li>kako pravilno tvoriti posamezen glas.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              S tem TomiTalk posnema klasično logopedsko obravnavo in jo naredi dostopno za vsakodnevno vadbo doma.
            </p>
          </section>

          {/* 9. Preverjanje izgovorjave */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              9. Preverjanje izgovorjave
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Funkcija Preverjanje izgovorjave omogoča sistematično oceno otrokovega govora in deluje podobno kot diagnostični pregled pri logopedu. Namenjena je ugotavljanju, kako otrok izgovarja posamezne soglasnike slovenskega jezika, še preden se začne ciljno vaditi.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Preverjanje omogoča objektiven vpogled v otrokovo artikulacijo ter predstavlja osnovo za oblikovanje osebnega načrta vaj in govorne podpore.
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Potek preverjanja izgovorjave</h4>
            <p className="text-muted-foreground leading-relaxed">
              Ob začetku preverjanja se otroku zaporedno prikazujejo besede s pripadajočimi slikami. Preverjanje poteka linearno, besedo za besedo, brez možnosti preskakovanja.
            </p>

            <h4 className="text-base font-medium text-foreground mb-2 mt-4">Standardna različica (za večino otrok)</h4>
            <p className="text-muted-foreground leading-relaxed">
              Preverjanje vsebuje:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>60 besed,</li>
              <li>ki pokrivajo 20 soglasnikov slovenskega jezika,</li>
              <li>vsak glas se preverja na treh položajih:
                <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                  <li>na začetku besede,</li>
                  <li>v sredini besede,</li>
                  <li>na koncu besede.</li>
                </ul>
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Ta struktura omogoča natančno analizo artikulacije posameznega glasu glede na njegov položaj v besedi.
            </p>

            <h4 className="text-base font-medium text-foreground mb-2 mt-4">Prilagojena različica (starost 3–4 leta)</h4>
            <p className="text-muted-foreground leading-relaxed">
              Za mlajše otroke je na voljo poenostavljena različica preverjanja, ki vsebuje:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>20 besed,</li>
              <li>vsak glas se preverja z eno besedo (namesto treh).</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Prilagojena različica je krajša, manj obremenjujoča in primerna za otroke z nižjo koncentracijo ali začetno stopnjo govornega razvoja.
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Nastavitve preverjanja</h4>
            <p className="text-muted-foreground leading-relaxed">
              Pred začetkom ali med preverjanjem lahko uporabnik odpre Nastavitve preverjanja, kjer lahko prilagodi dva ključna parametra.
            </p>

            <h4 className="text-base font-medium text-foreground mb-2 mt-4">1. Stopnja zahtevnosti</h4>
            <p className="text-muted-foreground leading-relaxed">
              Uporabnik lahko izbere eno izmed treh stopenj:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li><strong>Nizka</strong> – bolj popustljivo ocenjevanje izgovorjave</li>
              <li><strong>Srednja</strong> (privzeto, priporočeno) – uravnotežena nastavitev za večino otrok</li>
              <li><strong>Visoka</strong> – strožje ocenjevanje izgovorjave</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Stopnja zahtevnosti vpliva na kriterije prepoznavanja in ocenjevanja pravilnosti izgovorjene besede.
            </p>

            <h4 className="text-base font-medium text-foreground mb-2 mt-4">2. Čas snemanja</h4>
            <p className="text-muted-foreground leading-relaxed">
              Čas snemanja je nastavljiv:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li><strong>3 sekunde</strong> – za hitrejše otroke</li>
              <li><strong>4 sekunde</strong> (privzeto, priporočeno) – za večino otrok</li>
              <li><strong>5 sekund</strong> – za otroke z večjimi težavami ali počasnejšim govorom</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Izbrani čas določa dolžino snemanja po zagonu izgovora.
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Snemanje in zaznavanje govora</h4>
            <p className="text-muted-foreground leading-relaxed">
              Pri vsaki besedi otrok klikne gumb »Izgovori besedo«. Nato se prikaže animirano odštevanje glede na izbran čas snemanja (3, 4 ali 5 sekund).
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Med snemanjem aplikacija:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>snema otrokov govor,</li>
              <li>izvaja RMS analizo, s katero preveri, ali je bil zvok dejansko zaznan.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Če sistem zazna tišino:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>se prikaže opozorilo,</li>
              <li>otrok dobi možnost ponovnega poskusa.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Če je zvok zaznan:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>se posnetek samodejno pošlje v nadaljnjo obdelavo in ocenjevanje.</li>
            </ul>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Takojšnja povratna informacija</h4>
            <p className="text-muted-foreground leading-relaxed">
              Po vsaki besedi otrok prejme takojšnjo vizualno in motivacijsko povratno informacijo.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Ob uspešni izgovorjavi:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>prikaže se zeleno sporočilo »BRAVO«,</li>
              <li>slika se označi kot opravljena (sivinski učinek),</li>
              <li>omogočen je gumb »Naprej«,</li>
              <li>maskota otroka pohvali (npr. »Bravo, pravilno si povedal!«).</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Ob neuspešni izgovorjavi ali zaznani tišini:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>prikaže se rdeče opozorilo,</li>
              <li>ponujen je ponovni poskus,</li>
              <li>maskota spodbuja (npr. »Skoraj, poskusiva še enkrat s to besedo.«).</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Otrok tako vadi v varnem, spodbudnem in motivacijskem okolju.
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Shranjevanje in analiza rezultatov</h4>
            <p className="text-muted-foreground leading-relaxed">
              Vsi posnetki in rezultati se sproti shranjujejo:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>povezani so v enoten testni sklop,</li>
              <li>na voljo so za kasnejši pregled,</li>
              <li>omogočajo analizo napredka skozi čas.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              To omogoča:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>objektivno spremljanje govornega razvoja,</li>
              <li>primerjavo rezultatov med posameznimi preverjanji,</li>
              <li>podporo strokovni logopedski obravnavi.</li>
            </ul>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Zaključek testa in ponovljivost</h4>
            <p className="text-muted-foreground leading-relaxed">
              Preverjanje se zaključi samodejno:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>po 60 besedah pri standardni različici,</li>
              <li>po 20 besedah pri prilagojeni različici za starost 3–4 let.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Po zaključku se prikaže zaključno okno, preverjanje pa je pripravljeno za nadaljnjo analizo ali prihodnjo ponovitev.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Preverjanje je ponovljivo:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>prvo preverjanje se izvede ob začetku uporabe,</li>
              <li>nato je priporočeno ponavljanje vsakih tri mesece (do 5-krat letno).</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Takšna struktura omogoča jasen vpogled v napredek posameznih glasov skozi čas.
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Povezava z osebnim načrtom in vloga staršev</h4>
            <p className="text-muted-foreground leading-relaxed">
              Preverjanje izgovorjave predstavlja ključno diagnostično izhodišče za nadaljnje delo.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Staršem omogoča:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>jasen vpogled v glasove, ki otroku povzročajo težave,</li>
              <li>ciljno usmerjeno vadbo doma.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Na podlagi rezultatov preverjanja in morebitnega logopedskega poročila aplikacija:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>predlaga najprimernejše govorne igre in vaje,</li>
              <li>samodejno oblikuje Moj osebni načrt.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Rezultate lahko starši po potrebi:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>delijo z logopedom,</li>
              <li>uporabijo kot podporo pri strokovni obravnavi otroka.</li>
            </ul>
          </section>

          {/* 10. Video navodila */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              10. Video navodila
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Pomemben del vsebin v aplikaciji TomiTalk so strokovna video navodila, ki jih predstavi logopedinja.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Za vsak od 9 zahtevnejših glasov slovenskega jezika (npr. R, S, L, Š, Ž itd.) je na voljo kratek video posnetek, namenjen podpori pravilni izgovorjavi.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              V video navodilih logopedinja:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>na preprost in otrokom razumljiv način razloži izgovorjavo posameznega glasu,</li>
              <li>prikaže pravilen položaj ust, jezika in zob,</li>
              <li>izgovori glas in primere besed, ki vsebujejo ciljni glas,</li>
              <li>poda koristne napotke, ki otroku pomagajo razumeti, kako pravilno oblikovati glas.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Video posnetki so zasnovani kot praktični prikazi, kjer otrok:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>vidi realen primer pravilne izgovorjave,</li>
              <li>lažje razume, kaj mora pri izgovoru narediti,</li>
              <li>lahko posnema logopedinjo pri vadbi.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Video navodila so namenjena:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>otrokom, ki potrebujejo dodatno vizualno razlago,</li>
              <li>staršem, ki želijo razumeti pravilno izgovorjavo in otroku pomagati pri vadbi,</li>
              <li>dopolnitvi govornih vaj in iger z jasnim strokovnim prikazom.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              S tem TomiTalk otroku in staršem omogoča neposreden stik s strokovnim znanjem logopeda tudi v domačem okolju.
            </p>
          </section>

          {/* 11. Logopedski nasveti */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              11. Logopedski nasveti
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              TomiTalk ni namenjen le otrokom, temveč deluje tudi kot podporno orodje za starše. Zato aplikacija vključuje zbirko logopedskih nasvetov in strokovnih člankov, ki obravnavajo govorni razvoj otrok.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Članki so napisani v razumljivem in dostopnem jeziku ter obravnavajo teme, s katerimi se starši pogosto srečujejo, na primer:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>kaj storiti, če otrok določene glasove še ne izgovarja pravilno,</li>
              <li>kako spodbujati otroka, ki manj govori,</li>
              <li>kdaj je pri težavah, kot je jecljanje, smiselno poiskati strokovno pomoč.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Vsebina člankov:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>pojasnjuje norme govornega razvoja,</li>
              <li>opisuje vaje in igre, ki jih lahko starši izvajajo v aplikaciji TomiTalk ali doma,</li>
              <li>ponuja konkretne strategije za izboljšanje otrokove komunikacije.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Vse nasvete in članke pripravljajo logopedi in drugi strokovnjaki, zato so informacije strokovno preverjene in zanesljive.
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Nasveti za domače delo</h4>
            <p className="text-muted-foreground leading-relaxed">
              Posebna pozornost je namenjena nasvetom za domačo vadbo, saj je logopedska terapija najučinkovitejša takrat, ko se vaje izvajajo tudi izven logopedskih obravnav.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              TomiTalk staršem ponuja praktične ideje, kot so:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>artikulacijske igre med vsakodnevnimi dejavnostmi (npr. iskanje besed na določen glas),</li>
              <li>branje slikanic z zavestnim poudarjanjem problematičnih glasov,</li>
              <li>uporaba slikanic, kart ali drugih pripomočkov za poimenovanje predmetov,</li>
              <li>govorno-ustvarjalne in družabne igre, prilagojene vadbi govora.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              S temi nasveti TomiTalk staršem pomaga:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>bolje razumeti otrokov govorni razvoj,</li>
              <li>aktivno sodelovati pri vadbi,</li>
              <li>ustvariti spodbudno okolje za razvoj govora tudi doma.</li>
            </ul>
          </section>

          {/* 12. Sistem nagrajevanja */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              12. Sistem nagrajevanja in sledenje napredku
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Za ohranjanje otrokove motivacije TomiTalk uporablja premišljen sistem nagrajevanja, ki temelji na pozitivni spodbudi in občutku uspeha. Hkrati aplikacija omogoča natančno sledenje napredku, kar je dragoceno tako za starše kot za logopede.
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Sistem nagrajevanja za otroke</h4>
            <p className="text-muted-foreground leading-relaxed">
              Otroci za opravljene igre in vaje v aplikaciji prejemajo navidezne nagrade, kot so:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>zvezdice,</li>
              <li>posebne značke v obliki zmajčkov,</li>
              <li>pokali in trofeje.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong>Primer:</strong> za vsako uspešno zaključeno igro ali vajo otrok prejme zvezdico. Po 100 zbranih zvezdicah otrok prejme nagrado zmajčka in za 100 zvezdic oz. 10 zmajčkov prejme najvišjo nagrado pokal.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Pomembno:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>poudarek je na pohvali za trud in vztrajnost,</li>
              <li>učenje govora ostaja pozitivna in varna izkušnja.</li>
            </ul>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Gamifikacija kot motivacijski pristop</h4>
            <p className="text-muted-foreground leading-relaxed">
              Gamificiran pristop se je izkazal kot zelo učinkovit:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>otroci se veselijo nagrad,</li>
              <li>so pripravljeni večkrat ponoviti vajo,</li>
              <li>postopno začnejo pravilno izgovorjavo povezovati z občutkom uspeha in pohvale.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Starši pogosto opazijo, da otrok aplikacijo uporablja z veseljem, kar povečuje rednost vadbe.
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Samodejno beleženje aktivnosti</h4>
            <p className="text-muted-foreground leading-relaxed">
              Poleg nagrajevanja ima TomiTalk vgrajen tudi sistem sledenja napredku.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Vsakič, ko otrok zaključi:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>govorno igro,</li>
              <li>govorno vajo,</li>
              <li>preverjanje izgovorjave,</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              se ta aktivnost samodejno zabeleži v otrokov uporabniški profil.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              S tem se skozi čas gradi celovit pregled:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>opravljenih aktivnosti,</li>
              <li>pogostosti vaj,</li>
              <li>otrokovega napredka.</li>
            </ul>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Posebno beleženje preverjanja izgovorjave</h4>
            <p className="text-muted-foreground leading-relaxed">
              Preverjanje izgovorjave ima ločen sistem beleženja.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Testi se izvajajo v obliki testnih sej, pri katerih:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>se ocenjuje izgovorjava posameznih besed,</li>
              <li>se rezultati shranjujejo po besedah,</li>
              <li>se podatki shranijo v bazo za kasnejšo logopedsko obravnavo.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              To omogoča dolgoročno spremljanje izboljšav izgovorjave skozi čas.
            </p>
          </section>

          {/* 13. Stran »Moja stran« */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              13. Stran »Moja stran«
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Na strani Moja stran imajo uporabniki na voljo tudi grafični prikaz otrokovega napredka.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Poleg seznama opravljenih aktivnosti bodo podatki prikazani še vizualno, in sicer; število pridobljenih nagrad.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Takšen prikaz omogoča:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>hiter pregled že z enim pogledom,</li>
              <li>lažje razumevanje napredka,</li>
              <li>osnovo za pogovor med starši in logopedom,</li>
              <li>boljše načrtovanje nadaljnjih vaj.</li>
            </ul>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Celovit motivacijski sistem</h4>
            <p className="text-muted-foreground leading-relaxed">
              Sistem nagrajevanja in sledenja napredku skupaj tvorita celovit motivacijski mehanizem:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>otroku zagotavljata sprotno pohvalo in nagrade,</li>
              <li>staršem in logopedom pa objektivno merilo napredka.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Ker odpravljanje govornih težav pogosto traja več mesecev ali let, je redno beleženje tudi manjših uspehov izjemno pomembno. TomiTalk s tem pomaga ohranjati:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>vztrajnost,</li>
              <li>pozitiven odnos do vadbe,</li>
              <li>dolgoročno motivacijo za uspeh.</li>
            </ul>

          </section>

          {/* 14. Varnost, motivacija in dostopnost aplikacije */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              14. Varnost, motivacija in dostopnost aplikacije
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Pri razvoju aplikacije TomiTalk je bila posebna pozornost namenjena varni, spodbudni in otrokom prijazni uporabniški izkušnji, ob hkratnem zagotavljanju nadzora in zaupanja za starše.
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Varna uporaba za otroke</h4>
            <p className="text-muted-foreground leading-relaxed">
              Aplikacija je zasnovana tako, da:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>ne vsebuje nezaželenih oglasov,</li>
              <li>ne vključuje neprimernih ali zavajajočih vsebin,</li>
              <li>uporablja izključno vsebine, primerne otrokom od 3 do 10 let.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Vsi materiali (slike, besede, igre in vaje) so:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>starostno prilagojeni,</li>
              <li>pripravljeni v sodelovanju s strokovnjaki (logopedi, pedagogi),</li>
              <li>namenjeni otrokom z govornimi izzivi.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              S tem TomiTalk zagotavlja varno digitalno okolje, ki podpira otrokov razvoj.
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Vloga staršev in nadzor</h4>
            <p className="text-muted-foreground leading-relaxed">
              Otrok aplikacijo praviloma uporablja:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>skupaj s staršem ali</li>
              <li>pod nadzorom starša, zlasti pri mlajših otrocih.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Tak način uporabe omogoča:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>dodatno razlago ali pomoč po potrebi,</li>
              <li>boljše razumevanje otrokovega napredka,</li>
              <li>večjo varnost pri uporabi digitalnih vsebin.</li>
            </ul>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Motivacija kot ključni element uporabe</h4>
            <p className="text-muted-foreground leading-relaxed">
              Motivacija je eden ključnih temeljev aplikacije TomiTalk. Pri razvoju so se ustvarjalci zavedali, da so klasične govorne vaje za otroke pogosto naporne ali nezanimive, če niso ustrezno podprte z motivacijskim pristopom.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Zato TomiTalk uporablja:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>igrifikacijo (igre, nagrade, nivoji),</li>
              <li>igrive animacije in like,</li>
              <li>takojšnjo povratno informacijo s pomočjo umetne inteligence.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Otrok se uči skozi igro, kar:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>povečuje njegovo pozornost,</li>
              <li>spodbuja ponavljanje vaj,</li>
              <li>zmanjšuje upor do vadbe,</li>
              <li>preprečuje hitro izgubo zanimanja.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              S prijaznim likom in igrivim pristopom TomiTalk gradi pozitivno učno izkušnjo, kjer otrok:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>z veseljem sodeluje,</li>
              <li>posnema prikaze,</li>
              <li>vzpostavi navado rednega vadenja.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Motivacijski vidik aplikacije pomembno prispeva k temu, da otrok govorne vaje ne doživlja kot obveznost, temveč kot prijetno dejavnost.
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Dostopnost in časovna prilagodljivost</h4>
            <p className="text-muted-foreground leading-relaxed">
              TomiTalk je zasnovan kot časovno in krajevno dostopno orodje, ki ga je mogoče uporabljati:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>doma ali kjerkoli drugje,</li>
              <li>24 ur na dan,</li>
              <li>na različnih napravah (telefon, tablica, računalnik).</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Uporaba aplikacije ne zahteva:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>naročanja na termine,</li>
              <li>čakanja,</li>
              <li>prilagajanja urnikom.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Otrok lahko vadi:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>takoj, ko se pojavi potreba,</li>
              <li>takrat, ko je najbolj motiviran in zbran.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              To je še posebej pomembno v okoljih, kjer so čakalne dobe za logopedsko obravnavo dolge. TomiTalk omogoča, da starši in otroci ne čakajo pasivno, temveč lahko takoj začnejo z vajami.
            </p>
          </section>

        </div>
      </div>

    </div>
  );
};

export default KakoDeluje;
