import Header from "@/components/Header";

const SUPABASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co";

const getImageUrl = (filename: string) => {
  return `${SUPABASE_URL}/storage/v1/object/public/slike-ostalo/${filename}`;
};

const DelovanjeTest = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
        <h1 className="text-3xl font-bold text-dragon-green mb-8">
          Kako deluje preverjanje izgovorjave
        </h1>
        
        <div className="prose prose-slate max-w-none space-y-8 text-justify">

          {/* 1. Uvod */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              1. Kaj je preverjanje izgovorjave
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Preverjanje izgovorjave je kratek in preprost govorni preizkus, pri katerem otrok poimenuje slike oziroma izgovarja izbrane besede. Namen preizkusa je preveriti, kako otrok izgovarja posamezne glasove slovenskega jezika.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Uporablja se za začetno oceno govornega stanja ter za spremljanje napredka skozi čas. Na podlagi preverjanja lahko natančneje prepoznamo, kateri glasovi otroku povzročajo težave in kje potrebuje dodatno vajo.
            </p>
          </section>

          {/* 2. Kaj se preverja */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              2. Kaj se preverja
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Pri preverjanju se preverja 20 soglasnikov slovenske abecede. Za vsak soglasnik se izgovorjava preverja v treh položajih:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>na začetku besede (označeno kot B – začetek),</li>
              <li>na sredini besede (označeno kot B – sredina),</li>
              <li>na koncu besede (označeno kot B – konec).</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Na ta način dobimo celostno sliko otrokove izgovorjave posameznega glasu v različnih govornih položajih.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Preverjanje preverja:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>pravilnost izgovorjave posameznih glasov,</li>
              <li>ali otrok glas izpusti, zamenja ali popači,</li>
              <li>pri katerih glasovih ima otrok največ težav.</li>
            </ul>
          </section>

          {/* 3. Struktura preverjanja */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              3. Struktura preverjanja
            </h2>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Standardna različica (za večino otrok)</h4>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>60 besed, ki pokrivajo 20 soglasnikov slovenskega jezika.</li>
              <li>Vsak glas se preverja na treh položajih: na začetku, v sredini in na koncu besede.</li>
              <li>Slike in besede se prikazujejo v vnaprej določenem vrstnem redu, ki je enak za vse otroke.</li>
            </ul>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Prilagojena različica (starost 3–4 leta)</h4>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>20 besed – vsak glas se preverja z eno besedo (namesto treh).</li>
              <li>Krajša, manj obremenjujoča in primerna za otroke z nižjo koncentracijo ali začetno stopnjo govornega razvoja.</li>
            </ul>
          </section>

          {/* 4. Nastavitve preverjanja */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              4. Nastavitve preverjanja
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Pred začetkom ali med preverjanjem lahko uporabnik odpre Nastavitve preverjanja, kjer lahko prilagodi dva ključna parametra:
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Stopnja zahtevnosti</h4>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li><strong>Nizka</strong> – bolj popustljivo ocenjevanje izgovorjave</li>
              <li><strong>Srednja</strong> (privzeto, priporočeno) – uravnotežena nastavitev za večino otrok</li>
              <li><strong>Visoka</strong> – strožje ocenjevanje izgovorjave</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Stopnja zahtevnosti vpliva na kriterije prepoznavanja in ocenjevanja pravilnosti izgovorjene besede.
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Čas snemanja</h4>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li><strong>3 sekunde</strong> – za hitrejše otroke</li>
              <li><strong>4 sekunde</strong> (privzeto, priporočeno) – za večino otrok</li>
              <li><strong>5 sekund</strong> – za otroke z večjimi težavami ali počasnejšim govorom</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Izbrani čas določa dolžino snemanja po zagonu izgovora.
            </p>
          </section>

          {/* 5. Kako preverjanje poteka */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              5. Kako preverjanje poteka
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Otrok si ogleda slike in vsako besedo izgovori naglas. Aplikacija pri tem:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>posname otrokovo izgovorjavo,</li>
              <li>posnetke pregleda logoped,</li>
              <li>na podlagi poslušanja pripravi strokovno poročilo o otrokovi izgovorjavi.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Preverjanje je zasnovano tako, da je za otroka kratko, enostavno in brez pritiska.
            </p>
          </section>

          {/* 6. Prikaz napredka med preverjanjem */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              6. Prikaz napredka med preverjanjem
            </h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>Na vrhu zaslona so prikazani vsi glasovi soglasnikov, ki se preverjajo.</li>
              <li>Vsak glas ima tri korake (začetek, sredina, konec) pri standardni različici oziroma enega pri prilagojeni.</li>
              <li>Ko otrok izgovori prvo besedo za določen glas (npr. za glas B – BIK) in klikne naprej:
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>se polje glasu delno obarva zeleno (1/3),</li>
                  <li>to pomeni, da je otrok izgovoril 1 od 3 besed za ta glas.</li>
                </ul>
              </li>
              <li>Ko je polje glasu v celoti zeleno, pomeni, da je otrok izgovoril vse besede za določen soglasnik.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Ta prikaz omogoča jasen in pregleden vpogled v potek preverjanja.
            </p>

            <div className="my-6 flex justify-center">
              <img 
                src={getImageUrl("test_izgovorjave_1.png")} 
                alt="Prikaz napredka preverjanja izgovorjave z barvnimi polji glasov" 
                className="rounded-lg shadow-md max-w-full h-auto"
                loading="lazy"
                style={{ maxHeight: '350px' }}
              />
            </div>
          </section>

          {/* 7. Potek izgovorjave posamezne besede */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              7. Potek izgovorjave posamezne besede
            </h2>

            <div className="space-y-6">
              <div>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>1.</strong> Otrok si najprej ogleda sliko. Priporočljivo je, da besedo najprej tiho ponovi pri sebi.
                </p>
              </div>

              <div>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>2.</strong> Ko je otrok pripravljen na izgovorjavo, klikne gumb »Izgovori besedo«. S tem se začne odštevanje glede na izbran čas snemanja (3, 4 ali 5 sekund, privzeto 4 sekunde).
                </p>
                <div className="my-4 flex justify-center">
                  <img 
                    src={getImageUrl("bik_1.png")} 
                    alt="Gumb Izgovori besedo" 
                    className="rounded-lg shadow-md max-w-full h-auto"
                    loading="lazy"
                    style={{ maxHeight: '350px' }}
                  />
                </div>
              </div>

              <div>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>3.</strong> V času odštevanja mora otrok naglas izgovoriti besedo. Izgovorjava se v tem času samodejno posname in shrani.
                </p>
              </div>

              <div>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>4.</strong> Med odštevanjem je prikazan časovnik.
                </p>
                <div className="my-4 flex justify-center">
                  <img 
                    src={getImageUrl("bik_2.png")} 
                    alt="Časovnik odštevanja med izgovorjavo" 
                    className="rounded-lg shadow-md max-w-full h-auto"
                    loading="lazy"
                    style={{ maxHeight: '350px' }}
                  />
                </div>
              </div>

              <div>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>5.</strong> Ko se odštevanje zaključi, se namesto odštevalnika prikaže gumb »Naprej«.
                </p>
                <div className="my-4 flex justify-center">
                  <img 
                    src={getImageUrl("bik_3.png")} 
                    alt="Gumb Naprej po zaključenem snemanju" 
                    className="rounded-lg shadow-md max-w-full h-auto"
                    loading="lazy"
                    style={{ maxHeight: '350px' }}
                  />
                </div>
              </div>

              <div>
                <p className="text-muted-foreground leading-relaxed">
                  <strong>6.</strong> S klikom na gumb »Naprej« se otrok premakne na naslednjo besedo oziroma sliko.
                </p>
              </div>

              <p className="text-muted-foreground leading-relaxed mt-4">
                Postopek se ponavlja, dokler otrok ne izgovori vseh besed (60 pri standardni oz. 20 pri prilagojeni različici) in s tem zaključi preverjanje.
              </p>
            </div>
          </section>

          {/* 8. Snemanje in zaznavanje govora */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              8. Snemanje in zaznavanje govora
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Ko otrok klikne gumb »Izgovori besedo«, aplikacija začne snemati zvok z mikrofonom naprave. Sistem med snemanjem analizira raven zvoka (RMS – Root Mean Square), s čimer loči tišino od dejanske izgovorjave.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              To pomeni, da aplikacija zazna, ali je otrok dejansko izgovoril besedo ali je bilo tiho. Posnetki se samodejno shranijo za kasnejši pregled.
            </p>
          </section>

          {/* 9. Takojšnja povratna informacija */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              9. Takojšnja povratna informacija
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Po vsaki izgovorjeni besedi otrok prejme takojšnjo povratno informacijo:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li><strong>Uspešna izgovorjava</strong> – aplikacija prikaže spodbudo (npr. maskota z nasmehom).</li>
              <li><strong>Neuspešna izgovorjava ali tišina</strong> – aplikacija prijazno spodbudi otroka, da poskusi znova.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Cilj povratne informacije je motivirati otroka in zagotoviti, da se počuti varno med celotnim preverjanjem.
            </p>
          </section>

          {/* 10. Shranjevanje in analiza rezultatov */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              10. Shranjevanje in analiza rezultatov
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Vsak posnetek izgovorjave se samodejno shrani kot del testnega sklopa. Po zaključku preverjanja:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>posnetke pregleda logoped,</li>
              <li>logoped pripravi strokovno poročilo o otrokovi izgovorjavi,</li>
              <li>rezultati so podlaga za pripravo prilagojenih vaj in iger.</li>
            </ul>
          </section>

          {/* 11. Zaključek testa in ponovljivost */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              11. Zaključek preverjanja in ponovljivost
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Preverjanje se samodejno zaključi, ko otrok izgovori vse besede (60 pri standardni oz. 20 pri prilagojeni različici).
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Preverjanje je mogoče kadarkoli ponoviti. Pogostost izvajanja je prilagodljiva in odvisna od otrokovega tempa razvoja.
            </p>
          </section>

          {/* 12. Kdaj se preverjanje izvaja */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              12. Kdaj se preverjanje izvaja
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Priporočamo, da se preverjanje izgovorjave opravi:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>ob prvem začetku uporabe aplikacije,</li>
              <li>nato periodično (na vsake tri mesece),</li>
              <li>vedno, ko želimo preveriti napredek ali spremembe v izgovorjavi.</li>
            </ul>
          </section>

          {/* 13. Zakaj se preverjanje uporablja */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              13. Zakaj se preverjanje uporablja
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Rezultati preverjanja omogočajo:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>boljše razumevanje otrokovega govornega razvoja,</li>
              <li>prepoznavanje glasov, ki potrebujejo dodatno vajo,</li>
              <li>pripravo bolj prilagojenih vaj in iger,</li>
              <li>spremljanje napredka skozi čas.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Preverjanje izgovorjave je pomembna osnova za nadaljnje delo v aplikaciji.
            </p>
          </section>

          {/* 14. Povezava z osebnim načrtom */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              14. Povezava z osebnim načrtom in vloga staršev
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Na podlagi rezultatov preverjanja aplikacija (v okviru naročnine TomiTalk Pro) pripravi osebni načrt vaj in iger, prilagojen otrokovim govornim izzivom.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Starši imajo pri tem ključno vlogo:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>spodbujajo otroka k redni vadbi,</li>
              <li>spremljajo napredek v otrokovem profilu,</li>
              <li>zagotavljajo mirno in spodbudno okolje za vadbo.</li>
            </ul>
          </section>

          {/* 15. Pomembno obvestilo za starše */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              15. Pomembno obvestilo za starše
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Preverjanje izgovorjave:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>ni diagnostično orodje,</li>
              <li>ne nadomešča pregleda pri logopedu,</li>
              <li>služi kot podporno orodje za spremljanje in usmerjanje govornega razvoja.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Rezultati preizkusa so informativni in namenjeni lažjemu razumevanju otrokovih govorno-jezikovnih izzivov.
            </p>
          </section>

          {/* 16. Kako lahko otroku pomagate */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              16. Kako lahko otroku pomagate
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Otrok naj preverjanje opravlja:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li>v mirnem okolju,</li>
              <li>brez hitenja ali popravljanja,</li>
              <li>ob spodbudi, ne pritisku.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Najpomembneje je, da se otrok počuti sproščeno in varno.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default DelovanjeTest;
