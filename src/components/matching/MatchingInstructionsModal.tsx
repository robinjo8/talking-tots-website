import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface MatchingInstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const instructionContent = [
  {
    title: "OSNOVNI KONCEPT",
    text: "IGRA ZAPOREDJA JE IGRA RAZVRŠČANJA SLIK V PRAVILNI VRSTNI RED. CILJ IGRE JE, DA IGRALEC SLIKE V SPODNJI VRSTICI RAZPOREDI TAKO, DA SE UJEMAJO S PRAVILNIM VRSTNIM REDOM. VSAKA SLIKA PRIKAZUJE BESEDO, KI SE ZAČNE Z IZBRANO ČRKO."
  },
  {
    title: "ZAČETEK IGRE",
    text: "PRED ZAČETKOM IGRE SE PRIKAŽE ODŠTEVANJE OD 5 DO 1. PO ODŠTEVANJU SE NA ZASLONU PRIKAŽETA DVE VRSTICI S SLIKAMI. ZGORNJA VRSTICA PREDSTAVLJA PRAVILNI VRSTNI RED IN JE ZAKLENJENA. SPODNJA VRSTICA VSEBUJE ISTE SLIKE, VENDAR V NAKLJUČNEM VRSTNEM REDU. PRI STAREJŠIH STAROSTNIH SKUPINAH SE SLIKE V ZGORNJI VRSTICI NAJPREJ PRIKAŽEJO ZA OMEJEN ČAS, NATO PA SE SKRIJEJO."
  },
  {
    title: "PREMIKANJE SLIK",
    text: "IGRALEC PRIME SLIKO V SPODNJI VRSTICI IN JO POVLEČE NA DRUGO MESTO. MED PREMIKANJEM JE SLIKA OZNAČENA Z MODRO OBROBO. KO IGRALEC SLIKO SPUSTI, SE TA ZAMENJA Z DRUGO SLIKO NA IZBRANEM MESTU. PRI NAPREDNEJŠIH RAZLIČICAH IGRALEC SLIKE NAJPREJ IZBIRA IZ NABORA IN JIH NATO RAZVRŠČA S POMOČJO GUMBOV ZA PREMIK LEVO IN DESNO."
  },
  {
    title: "ZAKLJUČEK IGRE",
    text: "KO IGRALEC PRAVILNO RAZVRSTI VSE SLIKE, SE ODPRE POGOVORNO OKNO Z NASLOVOM ODLIČNO! IGRALEC MORA KLIKNITI NA VSAKO SLIKO IN PONOVITI BESEDO S 3-SEKUNDNIM SNEMANJEM. KO SO VSE BESEDE PONOVLJENE, SE PRIKAŽE RUMEN GUMB VZEMI ZVEZDICO, S KATERIM SE SHRANI NAPREDEK IN ZAKLJUČI IGRA."
  },
  {
    title: "RAZLIKE MED STAROSTNIMI SKUPINAMI",
    text: ""
  },
  {
    title: "STAROST 3–4 LETA",
    text: "PRIKAZANE SO 4 SLIKE. ZGORNJA VRSTICA S PRAVILNIM VRSTNIM REDOM JE VES ČAS VIDNA IN ZAKLENJENA. IGRALEC SAMO PREMIKA SLIKE V SPODNJI VRSTICI, DOKLER SE VRSTNI RED NE UJEMA."
  },
  {
    title: "STAROST 5–6 LET",
    text: "IGRALEC SI MORA NAJPREJ ZAPOMNITI VRSTNI RED SLIK. SLIKE V ZGORNJI VRSTICI SO PRIKAZANE 10 SEKUND, NATO SE SKRIJEJO. IGRALEC MORA NAJPREJ IZBRATI PRAVILNE SLIKE IZ NABORA (4 PRAVILNE IN 4 NAPAČNE). NATO MORA IZBRANE SLIKE RAZVRSTITI V PRAVILEN VRSTNI RED. NA VOLJO JE ENA UPORABA POMOČI, KI ZA 5 SEKUND PONOVNO PRIKAŽE PRAVILNI VRSTNI RED."
  },
  {
    title: "STAROST 7–8 LET",
    text: "PRIKAZANIH JE 5 SLIK. ČAS ZA POMNJENJE JE 10 SEKUND. NA VOLJO STA DVE UPORABI POMOČI. POTEK IGRE JE SICER ENAK KOT PRI STAROSTNI SKUPINI 5–6 LET."
  },
  {
    title: "STAROST 9–10 LET",
    text: "PRIKAZANIH JE 5 SLIK. ČAS ZA POMNJENJE JE SKRAJŠAN NA 7 SEKUND. NA VOLJO JE ENA UPORABA POMOČI. POTEK IGRE JE ENAK KOT PRI STAROSTNI SKUPINI 5–6 LET, VENDAR Z VEČJO ZAHTEVNOSTJO."
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
          <DialogTitle className="text-xl font-bold text-center uppercase">NAVODILA ZA IGRO ZAPOREDJA</DialogTitle>
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
