import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: "jigsaw" | "sliding" | "articulation" | "maze" | "bingo" | "sequence";
}

type InstructionItem = {
  text: string;
  icon?: "green" | "yellow" | "red";
};

export const InstructionsModal: React.FC<InstructionsModalProps> = ({
  isOpen,
  onClose,
  type = "jigsaw"
}) => {
  const content: InstructionItem[] = type === "sequence"
    ? [
        { text: "Na začetku se prikaže 5 slik za 10 sekund. Zapomni si vrstni red!" },
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
        { text: "Klikni na gumb ZAVRTI, da se izžreba naključna slika." },
        { text: "Poišči vse izžrebane slike na svoji mreži in jih klikni." },
        { text: "Če po 10 sekundah ne najdeš vseh slik, ti bo pomagala pomoč z utripajočim robom." },
        { text: "Ko najdeš vse slike, ponovi besedo v mikrofon." },
        { text: "Zapolni vseh 16 polj, da osvojiš zvezdico!" },
        { text: "Zvezdica se bo zabeležila pod VAJE na tvoji strani." }
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center mb-4">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="px-2 pb-4">
          <div className="space-y-4">
            {content.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                {getIcon(item.icon)}
                <p className="text-foreground leading-relaxed text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};