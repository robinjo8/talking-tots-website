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
    text: "Igra Zaporedja je igra razvrščanja slik v pravilni vrstni red. Cilj igre je, da igralec slike v spodnji vrstici razporedi tako, da se ujemajo s pravilnim vrstnim redom. Vsaka slika prikazuje besedo, ki se začne z izbrano črko."
  },
  {
    title: "Začetek igre",
    text: "Pred začetkom igre se prikaže odštevanje od 5 do 1. Po odštevanju se na zaslonu prikažeta dve vrstici s slikami. Zgornja vrstica predstavlja pravilni vrstni red in je zaklenjena. Spodnja vrstica vsebuje iste slike, vendar v naključnem vrstnem redu. Pri starejših starostnih skupinah se slike v zgornji vrstici najprej prikažejo za omejen čas, nato pa se skrijejo."
  },
  {
    title: "Premikanje slik",
    text: "Igralec prime sliko v spodnji vrstici in jo povleče na drugo mesto. Med premikanjem je slika označena z modro obrobo. Ko igralec sliko spusti, se ta zamenja z drugo sliko na izbranem mestu. Pri naprednejših različicah igralec slike najprej izbira iz nabora in jih nato razvršča s pomočjo gumbov za premik levo in desno."
  },
  {
    title: "Zaključek igre",
    text: "Ko igralec pravilno razvrsti vse slike, se odpre pogovorno okno z naslovom ODLIČNO! Igralec mora klikniti na vsako sliko in ponoviti besedo s 3-sekundnim snemanjem. Ko so vse besede ponovljene, se prikaže zaključno okno z napisom BRAVO! in rumenim gumbom VZEMI ZVEZDICO."
  },
  {
    title: "Razlike med starostnimi skupinami",
    text: ""
  },
  {
    title: "Starost 3–4 leta",
    text: "Prikazane so 4 slike. Zgornja vrstica s pravilnim vrstnim redom je ves čas vidna in zaklenjena. Igralec samo premika slike v spodnji vrstici, dokler se vrstni red ne ujema."
  },
  {
    title: "Starost 5–6 let",
    text: "Igralec si mora najprej zapomniti vrstni red slik. Slike v zgornji vrstici so prikazane 10 sekund, nato se skrijejo. Igralec mora najprej izbrati pravilne slike iz nabora (4 pravilne in 4 napačne). Nato mora izbrane slike razvrstiti v pravilen vrstni red. Na voljo je ena uporaba pomoči, ki za 5 sekund ponovno prikaže pravilni vrstni red."
  },
  {
    title: "Starost 7–8 let",
    text: "Prikazanih je 5 slik. Čas za pomnjenje je 10 sekund. Na voljo sta dve uporabi pomoči. Potek igre je sicer enak kot pri starostni skupini 5–6 let."
  },
  {
    title: "Starost 9–10 let",
    text: "Prikazanih je 5 slik. Čas za pomnjenje je skrajšan na 7 sekund. Na voljo je ena uporaba pomoči. Potek igre je enak kot pri starostni skupini 5–6 let, vendar z večjo zahtevnostjo."
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
          <DialogTitle className="text-xl font-bold text-center">Navodila za igro Zaporedja</DialogTitle>
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
