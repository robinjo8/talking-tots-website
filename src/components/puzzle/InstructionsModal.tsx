import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: "jigsaw" | "sliding" | "articulation" | "maze" | "bingo" | "sequence" | "dice" | "wheel" | "spomin";
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
        { text: "Na začetku se prikažejo 4 slike za 10 sekund. Zapomni si vrstni red!" },
        { text: "Ko se čas izteče, slike izginejo. Klikni na prazno polje in izberi pravilno sliko." },
        { text: "Slike se obarvajo glede na pravilnost:" },
        { text: "Pravilna slika na pravem mestu", icon: "green" },
        { text: "Pravilna slika na napačnem mestu", icon: "yellow" },
        { text: "Napačna slika", icon: "red" },
        { text: "Ko izbereš vse pravilne slike, premikaj slike levo in desno, da jih razporediš v pravilen vrstni red." },
        { text: "Pomoč (ikona očesa) ti za 5 sekund prikaže pravilni vrstni red. Uporabiš jo lahko 3-krat." }
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
        { text: "Sestavljanka je razdeljena na kvadrate, pri čemer je en kvadrat prazen." },
        { text: "Premikaj posamezne dele slike tako, da klikneš na polje, ki ga želiš premakniti." },
        { text: "Cilj je, da s premikanjem vseh delov slike sestaviš celotno sliko v pravilni obliki." },
        { text: "Ko bo igra končana, se bo predvajal posnetek logopeda." },
        { text: "Dobro poslušaj, nato pa ponovi besedo." }
      ]
    : type === "maze"
    ? [
        { text: "Premikaj zmajčka z miško (podrsaj) ali s puščičnimi tipkami." },
        { text: "Zmajček se premakne do naslednjega križišča ali zidu." },
        { text: "Cilj je priti od starta (zgoraj) do cilja (spodaj)." },
        { text: "Ko prideš do cilja, se bo prikazala slika besede na črko." },
        { text: "Poslušaj besedo in jo ponovi v mikrofon." },
        { text: "Osvoji zvezdo za vsak uspešno opravljen labirint!" }
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
        { text: "Klikni na gumb 'VRZI KOCKO' da vržeš kocko." },
        { text: "Kocka bo pokazala številko od 1 do 6." },
        { text: "Ta številka določi, katera slika se bo izbrala v stolpcu." },
        { text: "Vrzi kocko trikrat - za BITJE, POVEDEK in PREDMET." },
        { text: "Ko so vse tri slike izbrane, se prikaže smešna poved." },
        { text: "Poslušaj poved in jo ponovi s snemanjem." },
        { text: "Za vsako uspešno poved dobiš zvezdico!" }
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
    : [
        { text: "Sestavljaj sliko, dokler ni cela." },
        { text: "Ko bo slika končana, se bo predvajal posnetek logopeda." },
        { text: "Dobro poslušaj, kako logoped izgovori besedo." },
        { text: "Nato besedo jasno in glasno ponovi." }
      ];
  
  const title = type === "sequence"
    ? "Navodila za igro Zaporedja"
    : type === "articulation" 
    ? "Navodila za vajo" 
    : type === "sliding" 
    ? "Drsna igra"
    : type === "maze"
    ? "Navodila za labirint"
    : type === "bingo"
    ? "Navodila za Bingo"
    : type === "dice"
    ? "Navodila za Met kocke"
    : type === "wheel"
    ? "Navodila za igro"
    : type === "spomin"
    ? "Navodila za igro Spomin"
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