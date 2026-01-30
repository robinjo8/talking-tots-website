import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface MatchingInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const instructionContent = [
  {
    title: "",
    text: "Igra Ujemanja je prilagojena različnim starostnim skupinam (3–4 let, 5–6 let, 7–8 let in 9–10 let). Z naraščajočo starostjo se povečuje število stolpcev in zahtevnost povezovanja."
  },
  {
    title: "Osnovni koncept",
    text: "Igra Ujemanja je igra povezovanja enakih elementov med stolpci. Cilj igre je, da igralec v vseh stolpcih poišče in izbere elemente, ki predstavljajo isto besedo. Vsaka beseda se začne z izbrano črko (na primer C)."
  },
  {
    title: "Začetek igre",
    text: "Na zaslonu se prikažejo stolpci z elementi. Vsak stolpec vsebuje enake besede v drugačnem vrstnem redu ali obliki (slike, besedilo, sence, zvočni posnetki). Igralec mora v vsakem stolpcu najti element, ki pripada isti besedi."
  },
  {
    title: "Izbiranje elementov",
    text: "Igralec klikne na element v enem stolpcu, da ga izbere. Izbran element je označen z modro obrobo. Nato igralec klikne na ustrezne elemente v preostalih stolpcih. Ko so izbrani vsi elementi iste besede, se povežejo in obarvajo zeleno."
  },
  {
    title: "Pravila povezovanja",
    text: "Povezati je mogoče le elemente iz različnih stolpcev. Če igralec izbere napačne elemente, se izbira ponastavi. Igralec mora pravilno povezati vse elemente iste besede, preden lahko nadaljuje z naslednjo."
  },
  {
    title: "Zaključek igre",
    text: "Ko igralec pravilno poveže vse pare oziroma skupine, se odpre pogovorno okno z napisom ODLIČNO! Igralec mora klikniti na vsako sliko in ponoviti besedo s 3-sekundnim snemanjem. Ko so vse besede ponovljene, se prikaže rumen gumb VZEMI ZVEZDICO, s katerim se shrani napredek in zaključi igra."
  },
  {
    title: "Razlike med starostnimi skupinami",
    text: ""
  },
  {
    title: "Starost 3–4 leta",
    text: "Prikazana sta 2 stolpca s slikami. V vsakem stolpcu so enake slike v različnem vrstnem redu. Igralec poveže par s klikom na enako sliko v obeh stolpcih. Ob pravilnem paru se predvaja zvočni posnetek besede."
  },
  {
    title: "Starost 5–6 let",
    text: "Prikazani so 3 stolpci: zvočni posnetek (ikona zvočnika), zapisana beseda in slika. Igralec mora izbrati vse tri elemente iste besede. Najprej klikne na zvočnik, da sliši besedo, nato izbere ustrezno zapisano besedo in sliko."
  },
  {
    title: "Starost 7–8 let",
    text: "Prikazani so 3 stolpci: zvočni posnetek, zapisana beseda in slika. Potek igre je enak kot pri starostni skupini 5–6 let."
  },
  {
    title: "Starost 9–10 let",
    text: "Prikazani so 4 stolpci: zvočni posnetek, zapisana beseda, senčna slika in originalna slika. Igralec mora izbrati vse štiri elemente iste besede. To zahteva višjo stopnjo koncentracije in prepoznavanja."
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
              {section.title && <p className="font-bold text-sm">{section.title}</p>}
              {section.text && (
                <p className="text-sm text-muted-foreground">{section.text}</p>
              )}
              {index < instructionContent.length - 1 && <div className="h-3" />}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
