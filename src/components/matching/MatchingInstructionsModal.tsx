import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface MatchingInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const instructionContent = [
  {
    title: "Osnovni koncept",
    text: "Igra Ujemanja je igra povezovanja enakih slik. Cilj igre je, da igralec v dveh stolpcih poišče in poveže vse pare enakih slik. Vsaka slika prikazuje besedo, ki se začne z izbrano črko."
  },
  {
    title: "Začetek igre",
    text: "Na zaslonu se prikažeta dva stolpca s slikami. V vsakem stolpcu so enake slike, vendar v različnem vrstnem redu. Vsak stolpec vsebuje toliko slik, kolikor je parov za povezovanje."
  },
  {
    title: "Izbiranje slik",
    text: "Igralec klikne na sliko v enem stolpcu, da jo izbere. Izbrana slika je označena z modro obrobo. Nato igralec klikne na enako sliko v drugem stolpcu. Če sta sliki enaki, se par poveže in obe sliki se obarvata zeleno."
  },
  {
    title: "Pravila povezovanja",
    text: "Povezati je mogoče le slike iz različnih stolpcev. Če igralec klikne na dve različni sliki, se izbira ponastavi. Če igralec klikne na isto sliko dvakrat, se izbira prekliče."
  },
  {
    title: "Zaključek igre",
    text: "Ko igralec pravilno poveže vse pare, se odpre pogovorno okno z napisom ODLIČNO! V oknu so prikazane vse slike iz igre. Pod vsako sliko je zapisana beseda in gumb za predvajanje zvočnega posnetka."
  },
  {
    title: "Ponovitev besed",
    text: "Igralec klikne na vsako sliko, kar sproži 3-sekundno snemanje z vizualnim odštevalnikom 3–2–1. Po končanem snemanju se slika obarva sivo. Igralec lahko za vsako besedo predvaja zvočni posnetek s klikom na gumb z zvočnikom."
  },
  {
    title: "Vzemi zvezdico",
    text: "Ko igralec ponovi vse besede, se samodejno odpre zaslon z napisom BRAVO! in sliko zmajčka. S klikom na rumen gumb VZEMI ZVEZDICO se napredek shrani."
  },
  {
    title: "Nova igra / izhod",
    text: "Po osvojeni zvezdici se pojavi moder gumb za novo igro (levo spodaj). S klikom na gumb Hiška se odpre meni za vrnitev nazaj."
  }
];

export const MatchingInstructionsModal: React.FC<MatchingInstructionsModalProps> = ({
  isOpen,
  onClose
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">Navodila za Igro ujemanja</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {instructionContent.map((section, index) => (
            <div key={index}>
              <p className="font-bold text-sm">{section.title}</p>
              {section.text && (
                <p className="text-sm text-muted-foreground">{section.text}</p>
              )}
              {index < instructionContent.length - 1 && <div className="h-3" />}
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Button onClick={onClose}>RAZUMEM</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
