import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronDown, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ArticulationTestInfoDialogProps {
  open: boolean;
  onClose: () => void;
}

const ArticulationTestInfoDialog = ({
  open,
  onClose
}: ArticulationTestInfoDialogProps) => {
  const [readAgreement, setReadAgreement] = useState(false);
  const [termsAgreement, setTermsAgreement] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const canContinue = readAgreement && termsAgreement;

  // Show scroll hint after 5 seconds of no scrolling
  useEffect(() => {
    if (!open || hasScrolledToBottom) return;

    scrollTimeoutRef.current = setTimeout(() => {
      setShowScrollHint(true);
    }, 5000);

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [open, hasScrolledToBottom]);

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 30;
    
    // Reset the timer when user scrolls
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    setShowScrollHint(false);
    
    // Set new timer
    if (!hasScrolledToBottom) {
      scrollTimeoutRef.current = setTimeout(() => {
        setShowScrollHint(true);
      }, 5000);
    }
    
    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
      setShowScrollHint(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Dialog open={open}>
      <DialogContent 
        className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0 [&>button]:hidden overflow-hidden" 
        onPointerDownOutside={e => e.preventDefault()} 
        onEscapeKeyDown={e => e.preventDefault()}
      >
        <DialogHeader className="p-6 pb-4 border-b shrink-0">
          <DialogTitle className="text-xl font-bold text-center">
            Obvestilo pred začetkom preverjanja izgovorjave
          </DialogTitle>
        </DialogHeader>

        {/* Scroll hint arrow - appears below header after 5 seconds */}
        {showScrollHint && !hasScrolledToBottom && (
          <div className="flex justify-center py-2 bg-gradient-to-b from-orange-100 to-transparent">
            <div className="flex flex-col items-center text-orange-600 animate-bounce">
              <ChevronDown className="w-8 h-8" />
              <span className="text-xs font-medium">Prelistaj navzdol</span>
            </div>
          </div>
        )}

        <div 
          ref={scrollRef} 
          onScroll={handleScroll} 
          className="flex-1 min-h-0 overflow-auto"
        >
          <div className="px-6 py-4 space-y-6 text-sm leading-relaxed">
            <section>
              <h3 className="font-bold text-base mb-2">Kaj je preverjanje izgovorjave?</h3>
              <p className="text-muted-foreground">
                Preverjanje izgovorjave je kratek in preprost preizkus, pri katerem otrok poimenuje slike oziroma izgovarja izbrane besede. Namen preizkusa je preveriti, kako otrok izgovarja posamezne glasove slovenskega jezika.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-base mb-2">Kaj se preverja?</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                <li>pravilnost izgovorjave posameznih glasov,</li>
                <li>ali otrok glas izpusti, zamenja ali popači,</li>
                <li>pri katerih glasovih ima otrok največ težav.</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Preverjanje izgovorjave vključuje 60 skrbno izbranih besed, razporejenih po soglasnikih (brez samoglasnikov), kar omogoča enakomerno in ciljno oceno otrokove izgovorjave.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-base mb-2">Kako preverjanje poteka?</h3>
              <p className="text-muted-foreground mb-2">
                Otrok si ogleda slike in vsako besedo izgovori naglas. Aplikacija pri tem:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                <li>posname otrokovo izgovorjavo,</li>
                <li>posnetke pregleda logoped,</li>
                <li>na podlagi poslušanja pripravi strokovno poročilo o otrokovi izgovorjavi.</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Preverjanje je zasnovano tako, da je za otroka kratko, enostavno in brez pritiska.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-base mb-2">Zakaj se preverjanje uporablja?</h3>
              <p className="text-muted-foreground mb-2">Rezultati preverjanja omogočajo:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                <li>boljše razumevanje otrokovega govornega razvoja,</li>
                <li>prepoznavanje glasov, ki potrebujejo dodatno vajo,</li>
                <li>pripravo bolj prilagojenih vaj in iger,</li>
                <li>spremljanje napredka skozi čas.</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Preverjanje izgovorjave je pomembna osnova za nadaljnje delo v aplikaciji.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-base mb-2">Kako pogosto se preverjanje izvaja?</h3>
              <p className="text-muted-foreground mb-2">Priporočamo, da se preverjanje izgovorjave opravi:</p>
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
              <p className="text-muted-foreground mb-2">Preverjanje izgovorjave:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                <li>ni diagnostično orodje,</li>
                <li>ne nadomešča pregleda pri logopedu,</li>
                <li>služi kot podporno orodje za spremljanje in usmerjanje govornega razvoja.</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Rezultati preizkusa so informativni in namenjeni lažjemu razumevanju otrokovih govorno-jezikovnih izzivov.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-base mb-2">Kako lahko otroku pomagate?</h3>
              <p className="text-muted-foreground mb-2">Otrok naj preverjanje opravlja:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                <li>v mirnem okolju,</li>
                <li>brez hitenja ali popravljanja,</li>
                <li>ob spodbudi, ne pritisku.</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Najpomembneje je, da se otrok počuti sproščeno in varno.
              </p>
            </section>

            {/* Scroll indicator */}
            <div className="pt-4 pb-2">
              {!hasScrolledToBottom ? (
                <div className="flex flex-col items-center justify-center py-4 px-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700 font-medium text-center">
                    <ChevronDown className="w-5 h-5 animate-bounce" />
                    <span>Za nadaljevanje prosimo preberite celotno obvestilo do konca</span>
                    <ChevronDown className="w-5 h-5 animate-bounce" />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 py-4 px-4 bg-green-50 border border-green-200 rounded-lg text-green-700 font-medium">
                  <span>Sedaj lahko označite soglasja spodaj</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 pt-4 border-t space-y-4 shrink-0">
          <div className="space-y-3">
            <div className={`flex items-start space-x-3 ${!hasScrolledToBottom ? 'opacity-50' : ''}`}>
              <Checkbox 
                id="readAgreement" 
                checked={readAgreement} 
                onCheckedChange={checked => setReadAgreement(checked === true)} 
                disabled={!hasScrolledToBottom} 
                className="mt-0.5" 
              />
              <label 
                htmlFor="readAgreement" 
                className={`text-sm leading-relaxed ${hasScrolledToBottom ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              >
                Prebral/-a sem obvestilo in se strinjam, da lahko moj otrok začne s preverjanjem izgovorjave.
              </label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox 
                id="termsAgreement" 
                checked={termsAgreement} 
                onCheckedChange={checked => setTermsAgreement(checked === true)} 
                className="mt-0.5" 
              />
              <label htmlFor="termsAgreement" className="text-sm leading-relaxed cursor-pointer">
                Strinjam se s{" "}
                <a 
                  href="/splosni-pogoji" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-bold underline hover:text-primary" 
                  onClick={e => e.stopPropagation()}
                >
                  Splošnimi pogoji
                </a>{" "}
                spletne strani TomiTalk.
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleBack} 
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Nazaj
            </Button>
            <Button 
              onClick={onClose} 
              disabled={!canContinue} 
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Nadaljuj
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArticulationTestInfoDialog;