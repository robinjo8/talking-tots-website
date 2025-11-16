import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: "jigsaw" | "sliding" | "articulation" | "maze";
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({
  isOpen,
  onClose,
  type = "jigsaw"
}) => {
  const content = type === "articulation"
    ? [
        "Na tej strani lahko vadiš besede.",
        "Ob prikazu slike se predvaja zvok besede.",
        "Po koncu predvajanja ponovi besedo.",
        "Ko ponoviš besedo, klikni zeleni gumb 'Nova beseda'.",
        "Besede lahko ponavljaš po želji.",
        "Namen vaje je osvojiti črko, ki jo vadiš."
      ]
    : type === "sliding" 
    ? [
        "Sestavljanka je razdeljena na kvadrate, pri čemer je en kvadrat prazen.",
        "Premikaj posamezne dele slike tako, da klikneš na polje, ki ga želiš premakniti.",
        "Cilj je, da s premikanjem vseh delov slike sestaviš celotno sliko v pravilni obliki.",
        "Ko bo igra končana, se bo predvajal posnetek logopeda.",
        "Dobro poslušaj, nato pa ponovi besedo."
      ]
    : type === "maze"
    ? [
        "Premikaj zmajčka z miško (podrsaj) ali s puščičnimi tipkami.",
        "Zmajček se premakne do naslednjega križišča ali zidu.",
        "Cilj je priti od starta (zgoraj) do cilja (spodaj).",
        "Ko prideš do cilja, se bo prikazala slika besede na črko.",
        "Poslušaj besedo in jo ponovi v mikrofon.",
        "Osvoji zvezdo za vsak uspešno opravljen labirint!"
      ]
    : [
        "Sestavljaj sliko, dokler ni cela.",
        "Ko bo slika končana, se bo predvajal posnetek logopeda.",
        "Dobro poslušaj, kako logoped izgovori besedo.",
        "Nato besedo jasno in glasno ponovi."
      ];
  
  const title = type === "articulation" 
    ? "Navodila za vajo" 
    : type === "sliding" 
    ? "Drsna sestavljanka"
    : type === "maze"
    ? "Navodila za labirint"
    : "Navodila za igro Sestavljanka";

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
            {content.map((paragraph, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-dragon-green rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-foreground leading-relaxed text-sm">{paragraph}</p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};