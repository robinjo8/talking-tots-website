import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: "jigsaw" | "sliding" | "articulation" | "maze" | "bingo" | "sequence" | "dice" | "wheel" | "spomin" | "ponoviPoved";
}

type InstructionItem = {
  text: string;
  icon?: "green" | "yellow" | "red";
  bold?: boolean;
};

export const InstructionsModal: React.FC<InstructionsModalProps> = ({
  isOpen,
  onClose,
  type = "jigsaw"
}) => {
  const content: InstructionItem[] = type === "sequence"
    ? [
        { text: "Igra Zaporedja je prilagojena različnim starostnim skupinam (3–4 let, 5–6 let, 7–8 let in 9–10 let). Z naraščajočo starostjo se povečuje zahtevnost igre, čas za pomnenje se krajša in dodajajo se dodatni koraki." },
        { text: "Osnovni koncept", bold: true },
        { text: "Igra Zaporedja je igra razvrščanja slik v pravilni vrstni red. Cilj igre je, da igralec slike v spodnji vrstici razporedi tako, da se ujemajo s pravilnim vrstnim redom. Vsaka slika prikazuje besedo, ki se začne z izbrano črko (na primer C)." },
        { text: "Začetek igre", bold: true },
        { text: "Pred začetkom igre se prikaže odštevanje od 5 do 1. Po odštevanju se na zaslonu prikažeta dve vrstici s slikami. Zgornja vrstica predstavlja pravilni vrstni red in je zaklenjena. Spodnja vrstica vsebuje iste slike, vendar v naključnem vrstnem redu. Pri starejših starostnih skupinah se slike v zgornji vrstici najprej prikažejo za omejen čas, nato pa se skrijejo." },
        { text: "Premikanje slik", bold: true },
        { text: "Igralec prime sliko v spodnji vrstici in jo povleče na drugo mesto. Med premikanjem je slika označena z modro obrobo. Ko igralec sliko spusti, se ta zamenja z drugo sliko na izbranem mestu. Pri naprednejših različicah igralec slike najprej izbira iz nabora in jih nato razvršča s pomočjo gumbov za premik levo in desno." },
        { text: "Zaključek igre", bold: true },
        { text: "Ko igralec pravilno razvrsti vse slike, se prikaže napis ČESTITAM! Odpre se pogovorno okno z naslovom ODLIČNO! Igralec mora klikniti na vsako sliko in ponoviti besedo s 3-sekundnim snemanjem. Ko so vse besede ponovljene, se prikaže rumen gumb VZEMI ZVEZDICO, s katerim se shrani napredek in zaključi igra." },
        { text: "Razlike med starostnimi skupinami", bold: true },
        { text: "Starost 3–4 leta", bold: true },
        { text: "Prikazane so 4 slike. Zgornja vrstica s pravilnim vrstnim redom je ves čas vidna in zaklenjena. Igralec samo premika slike v spodnji vrstici, dokler se vrstni red ne ujema." },
        { text: "Starost 5–6 let", bold: true },
        { text: "Igralec si mora najprej zapomniti vrstni red slik. Slike v zgornji vrstici so prikazane 10 sekund, nato se skrijejo. Igralec mora najprej izbrati pravilne slike iz nabora (4 pravilne in 4 napačne). Nato mora izbrane slike razvrstiti v pravilen vrstni red. Na voljo je ena uporaba pomoči, ki za 5 sekund ponovno prikaže pravilni vrstni red." },
        { text: "Starost 7–8 let", bold: true },
        { text: "Prikazanih je 5 slik. Čas za pomnjenje je 10 sekund. Na voljo sta dve uporabi pomoči. Potek igre je sicer enak kot pri starostni skupini 5–6 let." },
        { text: "Starost 9–10 let", bold: true },
        { text: "Prikazanih je 5 slik. Čas za pomnjenje je skrajšan na 7 sekund. Na voljo je ena uporaba pomoči. Potek igre je enak kot pri starostni skupini 5–6 let, vendar z večjo zahtevnostjo." }
      ]
    : type === "articulation"
    ? [
        { text: "Na tej strani lahko vadiš besede." },
        { text: "Ob prikazu slike se predvaja zvok besede." },
        { text: "Po koncu predvajanja ponovi besedo." },
        { text: "Ko ponoviš besedo, klikni zeleni gumb 'Nova beseda'." },
        { text: "Besede lahko ponavljaš po želji." },
        { text: "Namen vaje je osvojiti črko, ki jo vadiš." }
      ]
    : type === "sliding" 
    ? [
        { text: "Osnovni koncept", bold: true },
        { text: "Igra Drsna sestavljanka je sestavljena iz mreže kvadratov, ki prikazujejo dele slike. En kvadrat je prazen in omogoča premikanje ostalih delov. Cilj je, da s premikanjem kosov sestaviš celotno sliko. Vsaka slika prikazuje besedo, ki se začne z izbrano črko." },
        { text: "Začetek igre", bold: true },
        { text: "Na zaslonu se prikaže mreža z razmetanimi deli slike. En kvadrat je prazen (sive barve). V ozadju je vidna bleda senca celotne slike, ki služi kot pomoč pri sestavljanju. Na vsakem kosu je prikazana številka za lažje sledenje." },
        { text: "Premikanje kosov", bold: true },
        { text: "Igralec klikne na kos, ki je ob praznem polju, da ga premakne na prazen prostor. Premikati je mogoče le kose, ki so neposredno ob praznem polju (levo, desno, zgoraj ali spodaj). Ko kos pravilno postaviš, se obroba obarva zeleno." },
        { text: "Zaključek sestavljanke", bold: true },
        { text: "Ko igralec pravilno postavi vse kose, se odpre pogovorno okno z napisom ODLIČNO! V oknu so prikazane štiri naključne slike, med katerimi je tudi pravkar sestavljena slika. Pod vsako sliko je zapisana beseda in gumb za predvajanje zvočnega posnetka." },
        { text: "Ponovitev besed", bold: true },
        { text: "Igralec klikne na vsako sliko, kar sproži 3-sekundno snemanje z vizualnim odštevalnikom 3–2–1. Po končanem snemanju se slika obarva sivo. Igralec lahko za vsako besedo predvaja zvočni posnetek s klikom na gumb z zvočnikom." },
        { text: "Vzemi zvezdico", bold: true },
        { text: "Ko igralec ponovi vse štiri besede, se samodejno odpre zaslon z napisom BRAVO! in sliko zmajčka. S klikom na rumen gumb VZEMI ZVEZDICO se napredek shrani." },
        { text: "Nova igra / izhod", bold: true },
        { text: "Po osvojeni zvezdici se pojavi moder gumb za novo igro (levo spodaj). S klikom na gumb Hiška se vrnete v meni." }
      ]
    : type === "maze"
    ? [
        { text: "Osnovni koncept", bold: true },
        { text: "Igra Labirint je igra iskanja poti skozi labirint. Cilj je, da zmajček pobere vse 4 zvezdice in pride do cilja (zastavice). Ob vsaki zvezdici mora igralec ponoviti besedo, ki se začne z izbrano črko." },
        { text: "Premikanje zmajčka", bold: true },
        { text: "Na mobilnih napravah igralec podrsne po zaslonu v želeno smer. Na namiznih napravah uporablja puščice gor/dol/levo/desno. Zmajček se premakne do naslednjega križišča ali zidu." },
        { text: "Pobiranje zvezdic", bold: true },
        { text: "Ko zmajček pride do zvezdice, se odpre pogovorno okno s sliko in besedo. Igralec klikne na sliko, kar sproži 3-sekundno snemanje z vizualnim odštevalnikom 3–2–1. Po končanem snemanju se zvezdica zabeleži in igralec nadaljuje pot." },
        { text: "Odklepanje cilja", bold: true },
        { text: "Cilj (zastavica) je na začetku zaklenjen. Ko igralec pobere vse 4 zvezdice, se zid pred ciljem odpre in zmajček lahko nadaljuje do zastavice." },
        { text: "Zaključek igre", bold: true },
        { text: "Ko zmajček pride do cilja, se odpre pogovorno okno z napisom ODLIČNO! Igralec ponovi še 4 besede. Po vseh ponovitvah se prikaže novo okno z zmajčkom in gumbom VZEMI ZVEZDICO, ki se shrani v napredek." },
        { text: "Nova igra / izhod", bold: true },
        { text: "Po osvojeni zvezdici se pojavi moder gumb za novo igro (levo spodaj). S klikom na gumb Hiška se vrnete v meni." }
      ]
    : type === "bingo"
    ? [
        { text: "Zavrti kolut", bold: true },
        { text: "Pritisni oranžni gumb ZAVRTI, da zavrtiš kolut z besedami." },
        { text: "Počakaj na rezultat", bold: true },
        { text: "Kolut se bo zavrtel in se ustavil na naključni sliki. Med vrtenjem se sliši zvok tikanja." },
        { text: "Najdi sliko na mreži (4 × 4)", bold: true },
        { text: "Ko se kolut ustavi, poišči na mreži vse slike, ki ustrezajo izbrani besedi. Pod kolutom je zapisano: Najdi: [BESEDA]." },
        { text: "Klikni na pravilne slike", bold: true },
        { text: "Klikni na vse slike, ki prikazujejo izbrano besedo. Ista beseda se lahko pojavi na več mestih." },
        { text: "Ponovi besedo", bold: true },
        { text: "Ko najdeš vse pravilne slike, se odpre okno. Klikni na sliko, začne se 3-sekundno imitirano snemanje, in glasno ponovi besedo. Igra se nadaljuje, dokler ne dokončaš celotne vrstice ali stolpca (4 slike v vrsti)." },
        { text: "BINGO", bold: true },
        { text: "Ko dosežeš BINGO, se prikaže čestitka. Klikni VZEMI ZVEZDICO, da se nagrada zabeleži." },
        { text: "Namig", bold: true },
        { text: "Če besede ne najdeš v 10 sekundah, pravilne slike začnejo utripati." },
        { text: "Nova igra / izhod", bold: true },
        { text: "Po osvojeni zvezdici se pojavi moder gumb za novo igro (levo spodaj). S klikom na gumb Hiška se vrnete v meni." },
        { text: "Cilj igre", bold: true },
        { text: "Vaditi izgovorjavo posamezne črke (na primer C, Č, K) na sredini in na koncu besed s pomočjo igre Bingo in zbiranja zvezdic." }
      ]
    : type === "dice"
    ? [
        { text: "Igra Smešne povedi je prilagojena za starostne skupine 5–6, 7–8 in 9–10 let." },
        { text: "Osnovni koncept", bold: true },
        { text: "Igra Smešne povedi je igra sestavljanja smešnih povedi s pomočjo meta kocke. Cilj je, da igralec z metanjem kocke izbere tri slike iz stolpcev BITJE, POVEDEK in PREDMET ter sestavi smešno poved. Vse besede vključujejo izbrano črko." },
        { text: "Začetek igre", bold: true },
        { text: "Na zaslonu se prikaže mreža s tremi stolpci (BITJE, POVEDEK, PREDMET) in šestimi vrsticami. Vsaka vrstica ustreza eni stranici kocke (1–6). Na levi strani so prikazane ikone kock s pikami." },
        { text: "Metanje kocke", bold: true },
        { text: "Kocka se najprej avtomatsko vrže za stolpec BITJE. Po pristanku se označi ustrezna vrstica v prvem stolpcu. Nato se kocka samodejno vrže za POVEDEK in nato še za PREDMET." },
        { text: "Prikaz povedi", bold: true },
        { text: "Ko so vse tri slike izbrane, se odpre pogovorno okno s tremi slikami in sestavljena povedjo. Igralec si lahko ogleda celotno poved in posluša zvočni posnetek." },
        { text: "Ponovitev povedi", bold: true },
        { text: "Igralec klikne gumb PONOVI, kar sproži 3-sekundno snemanje z vizualnim odštevalnikom 3–2–1. Igralec glasno ponovi celotno poved." },
        { text: "Indikator napredka", bold: true },
        { text: "Na vrhu zaslona je prikazan indikator napredka s 5 belimi pikami. Po vsaki uspešno zaključeni povedi se ena pika obarva oranžno." },
        { text: "Vzemi zvezdico", bold: true },
        { text: "Po 5 uspešno zaključenih povedih se prikaže okno z napisom BRAVO! in sliko zmajčka. S klikom na rumen gumb VZEMI ZVEZDICO se napredek shrani." },
        { text: "Nova igra / izhod", bold: true },
        { text: "Po osvojeni zvezdici se pojavi moder gumb za novo igro (levo spodaj). S klikom na gumb Hiška se vrnete v meni." },
        { text: "Cilj igre", bold: true },
        { text: "Vaditi izgovorjavo posamezne črke (na primer C, Č, K) s pomočjo sestavljanja smešnih povedi in zbiranja zvezdic." }
      ]
    : type === "wheel"
    ? [
        { text: "Zavrti kolo", bold: true },
        { text: "Pritisni oranžni gumb v sredini kolesa, da zavrtiš kolo besed." },
        { text: "Počakaj na rezultat", bold: true },
        { text: "Kolo se bo zavrtelo in se ustavilo na naključni besedi. Med vrtenjem se sliši zvok tikanja." },
        { text: "Ponovi besedo", bold: true },
        { text: "Ko se kolo ustavi, se prikaže okno z izbrano besedo in sliko. Klikni na sliko, da začneš snemanje (3 sekunde), in besedo ponovi glasno in razločno. Lahko tudi klikneš zeleni gumb z zvočnikom, da slišiš pravilno izgovorjavo." },
        { text: "Zberi 3 ponovitve", bold: true },
        { text: "Vsako besedo moraš ponoviti trikrat, da osvojiš zvezdico. Po vsaki ponovitvi se kolo znova zavrti na isto ali drugo besedo." },
        { text: "Vzemi zvezdico", bold: true },
        { text: "Ko dosežeš tri ponovitve iste besede, se pojavi zlati gumb VZEMI ZVEZDICO. Klikni nanj, da se nagrada zabeleži." },
        { text: "Nova igra / izhod", bold: true },
        { text: "S klikom na gumb Hiška se vrnete v meni." },
        { text: "Cilj igre", bold: true },
        { text: "Vaditi izgovorjavo posamezne črke (na primer C, Č, K) na začetku besed s pomočjo vrtenja kolesa in zbiranja zvezdic." }
      ]
    : type === "spomin"
    ? [
        { text: "Osnovni koncept", bold: true },
        { text: "Igra Spomin je klasična igra iskanja parov. Igralec mora najti vse pare enakih slik med 20 obrnjenimi karticami (10 parov). Vsaka kartica vsebuje sliko in zvočni posnetek besede, ki se začne z izbrano črko." },
        { text: "Začetek igre", bold: true },
        { text: "Na zaslonu se prikaže mreža 20 kartic (5 × 4 ali 4 × 5), ki so obrnjene z zeleno stranjo navzgor in prikazujejo znak vprašaja. Kartice so ob vsakem zagonu igre naključno premešane. Na vrhu zaslona je prikazan indikator napredka z 10 belimi pikicami, ki predstavljajo 10 parov." },
        { text: "Obračanje kartic", bold: true },
        { text: "Igralec pritisne na poljubno kartico, da jo obrne. Ko se kartica obrne, se prikaže slika in predvaja zvočni posnetek besede. Igralec lahko hkrati obrne največ dve kartici." },
        { text: "Preverjanje ujemanja", bold: true },
        { text: "Če sta obe kartici enaki (isti par), ostaneta obrnjeni in se odpre pogovorno okno. Če se kartici ne ujemata, se po 1,5 sekunde samodejno obrneta nazaj." },
        { text: "Pogovorno okno ob najdenem paru", bold: true },
        { text: "Ko igralec najde par, se prikaže okno z napisom PAR X OD 10. V oknu sta prikazana slika in beseda. Pod sliko je gumb za predvajanje zvočnega posnetka. Prikazano je navodilo: KLIKNI NA SPODNJO SLIKO IN PONOVI BESEDO." },
        { text: "Snemanje besede", bold: true },
        { text: "Igralec klikne na sliko, kar sproži 3-sekundno snemanje z vizualnim odštevalnikom 3–2–1. Po končanem snemanju se slika obarva sivo, aktivirata pa se gumba PONOVI in NADALJUJ. Gumb PONOVI ponastavi snemanje za isto besedo. Gumb NADALJUJ zapre okno in omogoči iskanje naslednjega para." },
        { text: "Indikator napredka", bold: true },
        { text: "Indikator napredka na vrhu zaslona se posodobi tako, da se ena pikica obarva oranžno za vsak najden par." },
        { text: "Zadnji par", bold: true },
        { text: "Ko igralec najde zadnji (deseti) par, se namesto gumba NADALJUJ prikaže rumen gumb VZEMI ZVEZDICO." },
        { text: "Zaključek igre", bold: true },
        { text: "Ko igralec pobere vse pare, se prikaže zaključno okno z napisom Čestitke! Gumb Poberi zvezdico shrani napredek in prikaže možnost za novo igro." }
      ]
    : type === "ponoviPoved"
    ? [
        { text: "Osnovni koncept", bold: true },
        { text: "Igra Ponovi poved je igra ponavljanja povedi iz treh besed. Zmajček skače po barvnih kamnih in ob vsakem skoku mora igralec ponoviti besedo ali celotno poved. Vse besede vsebujejo izbrano črko." },
        { text: "Začetek igre", bold: true },
        { text: "Na zaslonu se prikaže pot iz barvnih kamnov. Zmajček stoji na začetnem sivem kamnu. Na sredini zaslona je prikazan okrogel gumb s puščico za skok. Igralec pritisne gumb, da zmajček skoči na naslednji kamen." },
        { text: "Barvni kamni", bold: true },
        { text: "Pot je sestavljena iz barvnih kamnov, ki predstavljajo posamezne besede v povedi. Rdeči kamen pomeni prvo besedo, rumeni kamen drugo besedo in zeleni kamen tretjo besedo. Sivi kamen označuje mesto za ponovitev celotne povedi." },
        { text: "Skok na kamen", bold: true },
        { text: "Ko zmajček skoči na barvni kamen (rdeč, rumen ali zelen), se odpre pogovorno okno s sliko in besedo. Igralec mora klikniti gumb PONOVI, kar sproži 5-sekundno snemanje z vizualnim odštevalnikom. Po končanem snemanju se aktivira gumb NAPREJ." },
        { text: "Ponovitev celotne povedi", bold: true },
        { text: "Ko zmajček pride na sivi kamen, mora igralec ponoviti celotno poved iz treh besed. V pogovornem oknu so prikazane vse tri slike in celotna poved. Igralec klikne PONOVI in ponovi celotno poved." },
        { text: "Štiri povedi", bold: true },
        { text: "Igra obsega štiri povedi. Zmajček obkroži celotno pot in se vrne na začetek. Vsaka poved je sestavljena iz treh besed, ki vsebujejo izbrano črko." },
        { text: "Zaključek igre", bold: true },
        { text: "Ko igralec ponovi vse štiri povedi, se prikaže zaključno okno z napisom ČESTITKE! in sliko zmajčka. S klikom na rumen gumb VZEMI ZVEZDICO se napredek shrani." },
        { text: "Nova igra / izhod", bold: true },
        { text: "Po osvojeni zvezdici se pojavi moder gumb za novo igro (levo spodaj). S klikom na gumb Hiška se vrnete v meni." }
      ]
    : [
        { text: "Osnovni koncept", bold: true },
        { text: "Igra Sestavljanka je klasična igra sestavljanja slike iz kosov. Igralec mora pravilno sestaviti celotno sliko z vlečenjem posameznih kosov na prava mesta. Vsaka slika prikazuje besedo, ki se začne z izbrano črko." },
        { text: "Začetek igre", bold: true },
        { text: "Na zaslonu se prikaže okvir za sestavljanko. Na mobilnih napravah je okvir prikazan spodaj, na namiznih napravah pa na sredini zaslona. Kosi sestavljanke so raztreseni po zaslonu izven okvirja. V okvirju je vidna bleda senca slike, ki služi kot pomoč pri sestavljanju." },
        { text: "Premikanje kosov", bold: true },
        { text: "Igralec pritisne na poljuben kos in ga povleče na želeno mesto. Kos, ki ga igralec trenutno premika, je označen z modro obrobo. Ko igralec spusti kos dovolj blizu pravilnega položaja, se kos samodejno zaskoči na svoje pravo mesto. Pravilno postavljeni kosi dobijo zeleno obrobo in jih ni več mogoče premikati." },
        { text: "Zaključek sestavljanke", bold: true },
        { text: "Ko igralec pravilno postavi vse kose, se odpre pogovorno okno z napisom ODLIČNO! V oknu so prikazane štiri naključne slike, med katerimi je tudi pravkar sestavljena slika. Pod vsako sliko je zapisana beseda in gumb za predvajanje zvočnega posnetka." },
        { text: "Ponovitev besed", bold: true },
        { text: "Igralec klikne na vsako sliko, kar sproži 3-sekundno snemanje z vizualnim odštevalnikom 3–2–1. Po končanem snemanju se slika obarva sivo. Igralec lahko za vsako besedo predvaja zvočni posnetek s klikom na gumb z zvočnikom." },
        { text: "Vzemi zvezdico", bold: true },
        { text: "Ko igralec ponovi vse štiri besede, se prikaže rumen gumb VZEMI ZVEZDICO. S klikom na gumb se napredek shrani in prikaže se zaključno okno z napisom BRAVO!" }
      ];
  
  const title = type === "sequence"
    ? "Navodila za igro Zaporedja"
    : type === "articulation" 
    ? "Navodila za vajo" 
    : type === "sliding" 
    ? "Navodila za Drsno sestavljanko"
    : type === "maze"
    ? "Navodila za igro Labirint"
    : type === "bingo"
    ? "Navodila za Bingo"
    : type === "dice"
    ? "Navodila za igro Smešne povedi"
    : type === "wheel"
    ? "Navodila za igro"
    : type === "spomin"
    ? "Navodila za igro Spomin"
    : type === "ponoviPoved"
    ? "Navodila za igro Ponovi poved"
    : "Navodila za igro Sestavljanka";

  const getIcon = (icon?: "green" | "yellow" | "red") => {
    switch (icon) {
      case "green":
        return <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />;
      case "yellow":
        return <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />;
      case "red":
        return <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />;
      default:
        return <div className="w-2 h-2 bg-dragon-green rounded-full mt-2 flex-shrink-0"></div>;
    }
  };

  // Group items: bold items start a new section, non-bold items follow immediately
  const renderContent = () => {
    const elements: React.ReactNode[] = [];
    let sectionIndex = 0;
    
    for (let i = 0; i < content.length; i++) {
      const item = content[i];
      const nextItem = content[i + 1];
      const isLastInSection = !nextItem || nextItem.bold;
      
      if (item.bold) {
        // Add spacing before new section (except first)
        if (sectionIndex > 0) {
          elements.push(<div key={`spacer-${i}`} className="h-3" />);
        }
        sectionIndex++;
      }
      
      elements.push(
        <div key={i} className="flex items-start gap-3">
          {item.icon && getIcon(item.icon)}
          <p className={`leading-relaxed text-sm ${item.bold ? 'font-bold text-base text-foreground' : 'text-foreground'}`}>
            {item.text}
          </p>
        </div>
      );
    }
    
    return elements;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-bold text-center mb-4">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="px-2 pb-4 overflow-y-auto flex-1">
          <div className="space-y-1">
            {renderContent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};