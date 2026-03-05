import Header from "@/components/Header";

const InfoMojaStran = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
        <h1 className="text-3xl font-bold text-dragon-green mb-8">Moja stran</h1>

        <div className="prose prose-slate max-w-none space-y-8 text-justify">

          {/* 1. Uvod */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              1. Uvod
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Moja stran</strong> je osrednje mesto, kjer starši in otroci spremljajo celoten napredek pri vadbi govora. 
              Na enem mestu so zbrani vsi podatki o osvojenih zvezdicah, zmajčkih in pokalih. Stran je dostopna 
              prijavljenim uporabnikom z aktivno naročnino.
            </p>
          </section>

          {/* 2. Kaj uporabnik vidi */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              2. Kaj uporabnik vidi na strani
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Stran je razdeljena na tri glavne kartice, ki prikazujejo napredek otroka:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li><strong>Pokali</strong> — prikaz osvojenih pokalov in graf napredka proti naslednjemu pokalu.</li>
              <li><strong>Zmajčki</strong> — prikaz osvojenih zmajčkov (barvnih) in neosvojenih (sivih).</li>
              <li><strong>Igre in vaje</strong> — prikaz osvojenih zvezdic in napredek proti naslednjemu zmajčku.</li>
            </ul>
          </section>

          {/* 3. Zvezdice */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              3. Zvezdice
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Zvezdica je osnovna nagrada, ki jo otrok prejme za vsako opravljeno igro ali vajo. Zvezdice so temelj 
              celotnega sistema nagrajevanja — brez njih ni zmajčkov in brez zmajčkov ni pokalov.
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Kako otrok dobi zvezdico</h4>
            <p className="text-muted-foreground leading-relaxed">
              Zvezdice se <strong>ne podelijo samodejno</strong>. Ko otrok uspešno zaključi igro ali vajo, se prikaže 
              poseben dialog z gumbom <strong>»Vzemi zvezdico«</strong>. Šele ob kliku na ta gumb se zvezdica zabeleži 
              v sistem in prikaže na strani Moja stran. To otroku daje občutek aktivnega zbiranja nagrad.
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Prikaz na strani</h4>
            <p className="text-muted-foreground leading-relaxed">
              Zvezdice so prikazane v kartici <strong>»Igre in vaje«</strong>. Prikazana je mreža 5×2 (10 mest):
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li><strong>Polna zvezdica</strong> (rumena) — osvojena zvezdica.</li>
              <li><strong>Prazna zvezdica</strong> (siv obris) — še neosvojena zvezdica.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Pod mrežo je prikazan števec: <em>»X od 10 zvezdic do naslednjega zmajčka«</em>, ki otroku jasno pokaže, 
              koliko zvezdic še potrebuje. Prikazano je tudi skupno število vseh doslej zbranih zvezdic.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              V zgornjem desnem kotu kartice je <strong>info gumb (i)</strong>, ki ob kliku prikaže razlago: 
              <em>»Zvezdico si prislužiš za vsako opravljeno vajo ali zaključeno igro. Ko zbereš 10 zvezdic, si prislužiš enega zmajčka.«</em>
            </p>
          </section>

          {/* 4. Zmajčki */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              4. Zmajčki
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Zmajček je nagrada za vztrajnost. Ko otrok zbere <strong>10 zvezdic</strong>, avtomatično prejme enega zmajčka. 
              Zmajčki predstavljajo večji mejnik in otroku sporočajo, da redno in pridno vadi.
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Prikaz na strani</h4>
            <p className="text-muted-foreground leading-relaxed">
              Zmajčki so prikazani v kartici <strong>»Zmajčki«</strong> v mreži 5×2 (10 mest):
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li><strong>Barvni zmajček</strong> — osvojen zmajček.</li>
              <li><strong>Siv zmajček</strong> (z zmanjšano prosojnostjo) — še neosvojen zmajček.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Pod mrežo je prikazan števec: <em>»X od 10 zmajčkov do naslednjega pokala«</em> ter skupno število vseh 
              doslej zbranih zmajčkov.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Tudi tukaj je <strong>info gumb (i)</strong> z razlago: 
              <em>»Zmajček je nagrada za vztrajnost. Pridobiš ga, ko zbereš 10 zvezdic. Ko zbereš 10 zmajčkov, dobiš pokal!«</em>
            </p>
          </section>

          {/* 5. Pokali */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              5. Pokali
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Pokal je <strong>največja nagrada</strong> v sistemu TomiTalk. Otrok ga prejme, ko zbere 
              <strong> 10 zmajčkov</strong>, kar pomeni <strong>100 zvezdic</strong>. Pokal je dokaz izjemne vztrajnosti 
              in rednega vadenja.
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Graf napredka</h4>
            <p className="text-muted-foreground leading-relaxed">
              V kartici <strong>»Pokali«</strong> je prikazan graf z <strong>10 stolpci</strong>, ki predstavljajo pot 
              do pokala. Vsak stolpec ustreza enemu zmajčku (10 zvezdicam):
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>Stolpci imajo <strong>naraščajoče višine</strong> — vsak naslednji je višji, kar vizualno prikazuje napredovanje.</li>
              <li>Na vrhu <strong>trenutnega stolpca</strong> je prikazan zmajček Tomi, ki kaže, kje se otrok trenutno nahaja.</li>
              <li>Na <strong>10. stolpcu</strong> je prikazan siv pokal (neosvojen) ali barvni pokal z zmajčkom (osvojen).</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Pod grafom so prikazani <strong>osvojeni pokali</strong> — vsak kot majhna ikona pokala. Če otrok še nima 
              nobenega pokala, je prikazan en siv (neosvojen) pokal.
            </p>
          </section>

          {/* 6. Kaj se zgodi ob 100 zvezdicah */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              6. Kaj se zgodi ob 100 zvezdicah
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Ko otrok zbere <strong>100 zvezdic</strong> (torej 10 zmajčkov), se samodejno odpre obvestilo, kjer se prikaže 
              poseben dialog s sliko zmajčka Tomija s pokalom:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>Prikazano je <strong>število doseženih zvezdic</strong> (npr. 100, 200, 300…) in <strong>zaporedna številka pokala</strong>.</li>
              <li>Otrok klikne gumb <strong>»Vzemi pokal«</strong>, da potrdi prejem nagrade.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Ko otrok pokal potrdi, se ta zabeleži, da se praznovanje ne prikaže ponovno. Sistem se 
              <strong> ponovi pri vsakih naslednjih 100 zvezdicah</strong> — torej pri 200, 300, 400 zvezdicah itd. 
              Vsak pokal predstavlja nov mejnik.
            </p>
          </section>

          {/* 7. Kje otrok dobi zvezdice */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              7. Kje otrok dobi zvezdice
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Otrok zvezdice zbira na različne načine, in sicer skozi igre in vaje. Govorne igre prinesejo 1 zvezdico 
              za vsako opravljeno igro. Pri vajah za motoriko govora pa otrok po uspešno opravljenih vajah prejme 2 zvezdici.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default InfoMojaStran;
