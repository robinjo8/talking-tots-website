import Header from "@/components/Header";

const InfoMojaStran = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
        <h1 className="text-3xl font-bold text-dragon-green mb-8 text-center">Moja stran</h1>

        <div className="prose prose-slate max-w-none text-justify dark:prose-invert">

          {/* 1. Uvod */}
          <p>
            <strong>Moja stran</strong> je osrednje mesto, kjer starši in otroci spremljajo celoten napredek pri vadbi govora. 
            Na enem mestu so zbrani vsi podatki o osvojenih zvezdicah, zmajčkih in pokalih. Stran je dostopna 
            prijavljenim uporabnikom z aktivno naročnino.
          </p>

          {/* 2. Kaj uporabnik vidi */}
          <h2 className="text-dragon-green">Kaj uporabnik vidi na strani</h2>
          <p>
            Stran je razdeljena na tri glavne kartice, ki prikazujejo napredek otroka:
          </p>
          <ul>
            <li><strong>Pokali</strong> — prikaz osvojenih pokalov in graf napredka proti naslednjemu pokalu.</li>
            <li><strong>Zmajčki</strong> — prikaz osvojenih zmajčkov (barvnih) in neosvojenih (sivih).</li>
            <li><strong>Igre in vaje</strong> — prikaz osvojenih zvezdic in napredek proti naslednjemu zmajčku.</li>
          </ul>
          <p>
            Poleg treh kartic uporabnik vidi tudi <strong>Nasvet zmajčka Tomija</strong> (spodbuda za redno vadbo) 
            in <strong>drobtinice</strong> (breadcrumb navigacija) na vrhu strani za lažjo orientacijo.
          </p>

          {/* 3. Zvezdice */}
          <h2 className="text-dragon-green">Zvezdice ⭐</h2>
          <p>
            Zvezdica je osnovna nagrada, ki jo otrok prejme za vsako opravljeno igro ali vajo. Zvezdice so temelj 
            celotnega sistema nagrajevanja — brez njih ni zmajčkov in brez zmajčkov ni pokalov.
          </p>

          <h4>Kako otrok dobi zvezdico</h4>
          <p>
            Zvezdice se <strong>ne podelijo samodejno</strong>. Ko otrok uspešno zaključi igro ali vajo, se prikaže 
            poseben dialog z gumbom <strong>»Vzemi zvezdico«</strong>. Šele ob kliku na ta gumb se zvezdica zabeleži 
            v sistem in prikaže na strani Moja stran. To otroku daje občutek aktivnega zbiranja nagrad.
          </p>

          <h4>Prikaz na strani</h4>
          <p>
            Zvezdice so prikazane v kartici <strong>»Igre in vaje«</strong>. Prikazana je mreža 5×2 (10 mest):
          </p>
          <ul>
            <li><strong>Polna zvezdica</strong> (rumena) — osvojena zvezdica.</li>
            <li><strong>Prazna zvezdica</strong> (siv obris) — še neosvojena zvezdica.</li>
          </ul>
          <p>
            Pod mrežo je prikazan števec: <em>»X od 10 zvezdic do naslednjega zmajčka«</em>, ki otroku jasno pokaže, 
            koliko zvezdic še potrebuje. Prikazano je tudi skupno število vseh doslej zbranih zvezdic.
          </p>
          <p>
            V zgornjem desnem kotu kartice je <strong>info gumb (i)</strong>, ki ob kliku prikaže razlago: 
            <em>»Zvezdico si prislužiš za vsako opravljeno vajo ali zaključeno igro. Ko zbereš 10 zvezdic, si prislužiš enega zmajčka.«</em>
          </p>

          {/* 4. Zmajčki */}
          <h2 className="text-dragon-green">Zmajčki 🐉</h2>
          <p>
            Zmajček je nagrada za vztrajnost. Ko otrok zbere <strong>10 zvezdic</strong>, avtomatično prejme enega zmajčka. 
            Zmajčki predstavljajo večji mejnik in otroku sporočajo, da redno in pridno vadi.
          </p>

          <h4>Prikaz na strani</h4>
          <p>
            Zmajčki so prikazani v kartici <strong>»Zmajčki«</strong> v mreži 5×2 (10 mest):
          </p>
          <ul>
            <li><strong>Barvni zmajček</strong> — osvojen zmajček.</li>
            <li><strong>Siv zmajček</strong> (z zmanjšano prosojnostjo) — še neosvojen zmajček.</li>
          </ul>
          <p>
            Pod mrežo je prikazan števec: <em>»X od 10 zmajčkov do naslednjega pokala«</em> ter skupno število vseh 
            doslej zbranih zmajčkov.
          </p>
          <p>
            Tudi tukaj je <strong>info gumb (i)</strong> z razlago: 
            <em>»Zmajček je nagrada za vztrajnost. Pridobiš ga, ko zbereš 10 zvezdic. Ko zbereš 10 zmajčkov, dobiš pokal!«</em>
          </p>

          {/* 5. Pokali */}
          <h2 className="text-dragon-green">Pokali 🏆</h2>
          <p>
            Pokal je <strong>največja nagrada</strong> v sistemu TomiTalk. Otrok ga prejme, ko zbere 
            <strong> 10 zmajčkov</strong>, kar pomeni <strong>100 zvezdic</strong>. Pokal je dokaz izjemne vztrajnosti 
            in rednega vadenja.
          </p>

          <h4>Graf napredka</h4>
          <p>
            V kartici <strong>»Pokali«</strong> je prikazan graf z <strong>10 stolpci</strong>, ki predstavljajo pot 
            do pokala. Vsak stolpec ustreza enemu zmajčku (10 zvezdicam):
          </p>
          <ul>
            <li>Stolpci imajo <strong>naraščajoče višine</strong> — vsak naslednji je višji, kar vizualno prikazuje napredovanje.</li>
            <li>Stolpci so obarvani v <strong>različne barve</strong> (od svetlo zelene do temnejših odtenkov).</li>
            <li>Na vrhu <strong>trenutnega stolpca</strong> je prikazan zmajček Tomi, ki kaže, kje se otrok trenutno nahaja.</li>
            <li>Na <strong>10. stolpcu</strong> je prikazan siv pokal (neosvojen) ali barvni pokal z zmajčkom (osvojen).</li>
          </ul>
          <p>
            Pod grafom so prikazani <strong>osvojeni pokali</strong> — vsak kot majhna ikona pokala. Če otrok še nima 
            nobenega pokala, je prikazan en siv (neosvojen) pokal.
          </p>

          {/* 6. Kaj se zgodi ob 100 zvezdicah */}
          <h2 className="text-dragon-green">Kaj se zgodi ob 100 zvezdicah</h2>
          <p>
            Ko otrok zbere <strong>100 zvezdic</strong> (torej 10 zmajčkov), se samodejno odpre <strong>praznovanje</strong>:
          </p>
          <ul>
            <li>Prikaže se poseben dialog s sliko zmajčka Tomija s pokalom.</li>
            <li>Dialog vsebuje čestitke z <strong>imenom otroka</strong> (npr. »Čestitamo MARK za osvojeni pokal!«).</li>
            <li>Prikazano je <strong>število doseženih zvezdic</strong> (npr. 100, 200, 300…) in <strong>zaporedna številka pokala</strong>.</li>
            <li>Otrok klikne gumb <strong>»Vzemi pokal«</strong>, da potrdi prejem nagrade.</li>
          </ul>
          <p>
            Ko otrok pokal potrdi, se ta zabeleži, da se praznovanje ne prikaže ponovno. Sistem se 
            <strong> ponovi pri vsakih naslednjih 100 zvezdicah</strong> — torej pri 200, 300, 400 zvezdicah itd. 
            Vsak pokal predstavlja nov mejnik.
          </p>

          {/* 7. Kje otrok dobi zvezdice */}
          <h2 className="text-dragon-green">Kje otrok dobi zvezdice</h2>
          <p>
            Zvezdice je mogoče pridobiti pri naslednjih aktivnostih:
          </p>

          <h4>Govorne igre (1 zvezdica na igro)</h4>
          <p>
            Po vsaki uspešno zaključeni igri se prikaže dialog z gumbom »Vzemi zvezdico«. Zvezdice podelijo naslednje igre:
          </p>
          <ul>
            <li>Kolo besed</li>
            <li>Spomin</li>
            <li>Bingo</li>
            <li>Zabavna pot</li>
            <li>Smešne povedi</li>
            <li>Ponovi poved</li>
            <li>Povezi pare</li>
            <li>Kače in lestve</li>
            <li>in ostale govorne igre</li>
          </ul>

          <h4>Govorne vaje (2 zvezdici)</h4>
          <p>
            Pri vajah motorike govoril otrok opravi <strong>27 kartic</strong> z vajami za razgibavanje ust, ustnic in 
            jezika. Ko zaključi vse kartice, prejme <strong>2 zvezdici</strong> (namesto ene).
          </p>

          <h4>Pomembno</h4>
          <p>
            Zvezdice se <strong>nikoli ne podelijo samodejno</strong> — vedno je potreben ročni klik na gumb 
            »Vzemi zvezdico«. To zagotavlja, da otrok aktivno sodeluje pri zbiranju nagrad in da se zvezdice 
            ne podvajajo.
          </p>

          {/* 8. Nasvet zmajčka Tomija */}
          <h2 className="text-dragon-green">Nasvet zmajčka Tomija</h2>
          <p>
            Pod karticami napredka je prikazana posebna kartica z nasvetom zmajčka Tomija. Kartica vsebuje 
            spodbudo za redno vadbo govora, prilagojeno imenu izbranega otroka (npr. »Tomi sporoča MARK: 
            Vadi vsak dan po 10 minut!«). Namen kartice je motivirati otroka in starše k redni vadbi.
          </p>

          {/* 9. Navigacija */}
          <h2 className="text-dragon-green">Navigacija</h2>
          <p>
            Na vrhu strani so prikazane <strong>drobtinice</strong> (breadcrumb navigacija), ki uporabniku 
            omogočajo hitro vračanje na prejšnje strani. Drobtinice prikazujejo pot, po kateri je uporabnik 
            prišel do trenutne strani (npr. Domov → Moja stran).
          </p>

          {/* 10. Tehnični podatki */}
          <h2 className="text-dragon-green">Tehnični podatki za starše</h2>
          <p>
            Vsi podatki o napredku se shranjujejo v varno podatkovno bazo za vsakega otroka posebej. 
            To pomeni, da:
          </p>
          <ul>
            <li>Napredek je vedno shranjen, tudi če zamenjate napravo.</li>
            <li>Če imate več otrok, ima vsak svoj ločen napredek.</li>
            <li>Podatki se osvežujejo v realnem času — takoj po kliku na »Vzemi zvezdico« se sprememba 
                prikaže na strani Moja stran.</li>
            <li>Sistem samodejno preračunava zmajčke in pokale na podlagi skupnega števila zvezdic.</li>
          </ul>

        </div>
      </div>
    </div>
  );
};

export default InfoMojaStran;
