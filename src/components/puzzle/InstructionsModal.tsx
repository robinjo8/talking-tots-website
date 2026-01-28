import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: "jigsaw" | "sliding" | "articulation" | "maze" | "bingo" | "sequence" | "dice" | "wheel";
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-bold text-center mb-4">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="px-2 pb-4 overflow-y-auto flex-1">
          <div className="space-y-4">
            {content.map((item, index) => (
              <div key={index} className={`flex items-start gap-3 ${item.bold ? 'mt-2' : ''}`}>
                {item.icon && getIcon(item.icon)}
                <p className={`leading-relaxed text-sm ${item.bold ? 'font-bold text-base text-foreground' : 'text-foreground'}`}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};