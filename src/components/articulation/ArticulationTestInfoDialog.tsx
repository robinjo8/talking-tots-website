import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

interface ArticulationTestInfoDialogProps {
  open: boolean;
  onClose: () => void;
}

const ArticulationTestInfoDialog = ({ open, onClose }: ArticulationTestInfoDialogProps) => {
  const [readAgreement, setReadAgreement] = useState(false);
  const [termsAgreement, setTermsAgreement] = useState(false);

  const canContinue = readAgreement && termsAgreement;

  return (
    <Dialog open={open}>
      <DialogContent 
        className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0 [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-xl font-bold text-center">
            Obvestilo pred začetkom testa izgovorjave
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 max-h-[50vh]">
          <div className="py-4 space-y-6 text-sm leading-relaxed">
            <section>
              <h3 className="font-bold text-base mb-2">Kaj je test izgovorjave?</h3>
              <p className="text-muted-foreground">
                Test izgovorjave (artikulacijski test) je kratek in preprost preizkus, pri katerem otrok poimenuje slike oziroma izgovarja izbrane besede. Namen testa je preveriti, kako otrok izgovarja posamezne glasove slovenskega jezika.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-base mb-2">Kaj se s testom preverja?</h3>
              <p className="text-muted-foreground mb-2">S testom spremljamo:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                <li>pravilnost izgovorjave posameznih glasov,</li>
                <li>ali otrok glas izpusti, zamenja ali popači,</li>
                <li>pri katerih glasovih ima otrok največ težav.</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Test vključuje 60 skrbno izbranih besed, razporejenih po soglasnikih (brez samoglasnikov), kar omogoča enakomerno in ciljno oceno otrokove izgovorjave.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-base mb-2">Kako test poteka?</h3>
              <p className="text-muted-foreground mb-2">
                Otrok si ogleda slike in vsako besedo izgovori naglas. Aplikacija pri tem:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                <li>posname otrokovo izgovorjavo,</li>
                <li>posnetke pregleda logoped,</li>
                <li>na podlagi poslušanja pripravi strokovno poročilo o otrokovi izgovorjavi.</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Test je zasnovan tako, da je za otroka kratek, enostaven in brez pritiska.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-base mb-2">Zakaj se test uporablja?</h3>
              <p className="text-muted-foreground mb-2">Rezultati testa omogočajo:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                <li>boljše razumevanje otrokovega govornega razvoja,</li>
                <li>prepoznavanje glasov, ki potrebujejo dodatno vajo,</li>
                <li>pripravo bolj prilagojenih vaj in iger,</li>
                <li>spremljanje napredka skozi čas.</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Test je pomembna osnova za nadaljnje delo v aplikaciji.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-base mb-2">Kako pogosto se test izvaja?</h3>
              <p className="text-muted-foreground mb-2">Priporočamo, da se test izgovorjave opravi:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                <li>ob prvem začetku uporabe aplikacije,</li>
                <li>nato periodično (na vsake tri mesece),</li>
                <li>vedno, ko želimo preveriti napredek ali spremembe v izgovorjavi.</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Pogostost izvajanja je prilagodljiva in odvisna od otrokovega tempa razvoja.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-base mb-2">Pomembno obvestilo za starše</h3>
              <p className="text-muted-foreground mb-2">Test izgovorjave:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                <li>ni diagnostično orodje,</li>
                <li>ne nadomešča pregleda pri logopedu,</li>
                <li>služi kot podporno orodje za spremljanje in usmerjanje govornega razvoja.</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Rezultati testa so informativni in namenjeni lažjemu razumevanju otrokovih govorno-jezikovnih izzivov.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-base mb-2">Kako lahko otroku pomagate?</h3>
              <p className="text-muted-foreground mb-2">Otrok naj test opravlja:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                <li>v mirnem okolju,</li>
                <li>brez hitenja ali popravljanja,</li>
                <li>ob spodbudi, ne pritisku.</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Najpomembneje je, da se otrok počuti sproščeno in varno.
              </p>
            </section>
          </div>
        </ScrollArea>

        <div className="p-6 pt-4 border-t space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="readAgreement"
                checked={readAgreement}
                onCheckedChange={(checked) => setReadAgreement(checked === true)}
                className="mt-0.5"
              />
              <label
                htmlFor="readAgreement"
                className="text-sm leading-relaxed cursor-pointer"
              >
                Prebral/-a sem obvestilo in se strinjam, da lahko moj otrok začne s testom izgovorjave.
              </label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="termsAgreement"
                checked={termsAgreement}
                onCheckedChange={(checked) => setTermsAgreement(checked === true)}
                className="mt-0.5"
              />
              <label
                htmlFor="termsAgreement"
                className="text-sm leading-relaxed cursor-pointer"
              >
                Strinjam se s{" "}
                <a
                  href="/splosni-pogoji"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold underline hover:text-primary"
                  onClick={(e) => e.stopPropagation()}
                >
                  Splošnimi pogoji
                </a>{" "}
                spletne strani TomiTalk.
              </label>
            </div>
          </div>

          <Button
            onClick={onClose}
            disabled={!canContinue}
            className="w-full bg-primary hover:bg-primary/90"
          >
            Nadaljuj
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArticulationTestInfoDialog;
