import Header from "@/components/Header";
import { Link } from "react-router-dom";

const InfoGovor = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
        <h1 className="text-3xl font-bold text-dragon-green mb-8">Govor</h1>

        <div className="prose prose-slate max-w-none space-y-8 text-justify">

          {/* 1. Uvod */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              1. Kaj najdem v razdelku Govor
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Razdelek Govor je osrednji del aplikacije, namenjen vadbi in spremljanju otrokove izgovorjave. Tukaj so zbrane vse aktivnosti, ki otroku pomagajo pri razvoju govora: govorne igre, govorne vaje, preverjanje izgovorjave in osebni načrt vaj.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Aktivnosti so zasnovane tako, da so za otroka zabavne, kratke in spodbudne – brez pritiska in popravljanja.
            </p>
          </section>

          {/* 2. Govorne igre */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              2. Govorne igre
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Govorne igre so interaktivne igre, namenjene zabavni vadbi izgovorjave posameznih glasov. Otrok med igro nevede vadi glasove v različnih položajih znotraj besed – na začetku, na sredini ali na koncu.
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Igre za vadbo glasov na začetku besed</h4>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li><strong>Kolo besed</strong> – otrok vrti kolo in izgovori besedo, ki se prikaže.</li>
              <li><strong>Igra ujemanja</strong> – iskanje parov slik, ki se začnejo z enakim glasom.</li>
              <li><strong>Zaporedja</strong> – razvrščanje slik v pravilno zaporedje.</li>
              <li><strong>Spomin</strong> – klasična igra spomin s slikami in besedami.</li>
              <li><strong>Drsna igra</strong> – otrok drsa slike in ob tem vadi izgovorjavo.</li>
              <li><strong>Labirint</strong> – iskanje poti skozi labirint s pomočjo besed.</li>
              <li><strong>Sestavljanke</strong> – sestavljanje slik ob vadbi glasov.</li>
            </ul>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Igre za vadbo glasov na sredini in koncu besed</h4>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li><strong>Zabavna pot</strong> – otrok sledi poti in vadi glasove na sredini in koncu besed.</li>
              <li><strong>Bingo</strong> – igra bingo z besedami, ki vadijo glasove na sredini in koncu besed.</li>
            </ul>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Igre za vadbo glasov na začetku, sredini in koncu besed</h4>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li><strong>Ponovi poved</strong> – otrok ponovi poved in vadi izgovorjavo glasov na začetku, na sredini in na koncu.</li>
              <li><strong>Smešne povedi</strong> – zabavne povedi za vadbo glasov v vseh položajih.</li>
            </ul>

            <p className="text-muted-foreground leading-relaxed mt-4">
              Vsaka igra omogoča izbiro posameznega glasu, ki ga otrok želi vaditi. Igre so prilagojene različnim starostnim skupinam in stopnjam govornega razvoja.
            </p>
          </section>

          {/* 3. Govorne vaje */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              3. Govorne vaje
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Govorne vaje so strukturirane vaje, namenjene krepitvi govoril in pravilni izgovorjavi glasov. Na voljo so tri vrste vaj:
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Vaje motorike govoril</h4>
            <p className="text-muted-foreground leading-relaxed">
              Vaje za razgibavanje govoril – ust, ustnic in jezika. Pomagajo krepiti mišice, ki so ključne za pravilno izgovorjavo glasov.
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Moji prvi glasovi</h4>
            <p className="text-muted-foreground leading-relaxed">
              Animirani prikaz glasov, ki otroku pomaga prepoznati in posnemati posamezne glasove slovenskega jezika. Primerno za mlajše otroke, ki šele spoznavajo glasove.
            </p>

            <h4 className="text-lg font-medium text-foreground mb-2 mt-6">Video navodila</h4>
            <p className="text-muted-foreground leading-relaxed">
              Kratki videoposnetki logopeda, ki prikazujejo pravilno izgovorjavo posameznih glasov. Starši in otroci lahko sledijo navodilom in vadijo skupaj.
            </p>
          </section>

          {/* 4. Preverjanje izgovorjave */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              4. Preverjanje izgovorjave
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Preverjanje izgovorjave je kratek govorni preizkus, pri katerem otrok poimenuje slike oziroma izgovarja izbrane besede. Namen preizkusa je sistematično preveriti, kako otrok izgovarja vseh 20 soglasnikov slovenskega jezika.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Na voljo sta dve različici:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li><strong>Standardna različica</strong> – 60 besed, ki pokrivajo vsak soglasnik na treh položajih (začetek, sredina, konec besede).</li>
              <li><strong>Prilagojena različica</strong> (za otroke 3–4 leta) – 20 besed, ena na glas, krajša in manj obremenjujoča.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Posnetke izgovorjave pregleda logoped, ki na podlagi poslušanja pripravi strokovno poročilo o otrokovi izgovorjavi. Rezultati so podlaga za pripravo prilagojenih vaj in iger.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <Link to="/delovanje-testa" className="text-dragon-green hover:underline font-medium">
                Več o tem, kako preverjanje izgovorjave deluje →
              </Link>
            </p>
          </section>

          {/* 5. Moj osebni načrt */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              5. Moj osebni načrt (TomiTalk Pro)
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Moj osebni načrt je 90-dnevni načrt vaj in iger, ki je v celoti prilagojen otrokovim govornim izzivom. Načrt nastane na podlagi rezultatov preverjanja izgovorjave – logoped na podlagi poročila določi, katere glasove mora otrok vaditi.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Načrt vsebuje dnevne aktivnosti (igre in vaje), ki so razporejene skozi celotno obdobje. Otrok in starši lahko spremljata napredek in opravljata aktivnosti v lastnem tempu.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Osebni načrt je na voljo v okviru naročnine <strong>TomiTalk Pro</strong>.
            </p>
          </section>

          {/* 6. Sistem nagrajevanja */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              6. Sistem nagrajevanja
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Za vsako opravljeno aktivnost (igro ali vajo) otrok prejme zvezdice. Zvezdice spodbujajo redno vadbo in otroku dajejo občutek napredka. Na vrhu zaslona je prikazan dnevni pregled zbranih zvezdic.
            </p>
          </section>

          {/* 7. Za koga je namenjeno */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              7. Za koga je namenjeno
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Aktivnosti v razdelku Govor so prilagojene štirim starostnim skupinam:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
              <li><strong>3–4 leta</strong> – enostavnejše igre in prilagojena različica preverjanja.</li>
              <li><strong>5–6 let</strong> – širši nabor iger in vaj za razvoj glasov.</li>
              <li><strong>7–8 let</strong> – zahtevnejše igre in vaje za utrjevanje izgovorjave.</li>
              <li><strong>9–10 let</strong> – napredne vaje za glasove, ki otroku še povzročajo težave.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Vsebine so zasnovane tako, da so primerne za posamezno starostno obdobje in otrokov tempo razvoja.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default InfoGovor;
