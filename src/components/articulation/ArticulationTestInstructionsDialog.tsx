import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";

interface ArticulationTestInstructionsDialogProps {
  open: boolean;
  onClose: () => void;
}

const SUPABASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co";

const ArticulationTestInstructionsDialog = ({ open, onClose }: ArticulationTestInstructionsDialogProps) => {
  const getImageUrl = (filename: string) => {
    return `${SUPABASE_URL}/storage/v1/object/public/slike-ostalo/${filename}`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-2xl font-bold text-center">
            Kako deluje preverjanje izgovorjave
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="px-6 pb-6 max-h-[75vh]">
          <div className="space-y-6 text-gray-700">
            {/* Kratek povzetek */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Kratek povzetek</h3>
              <p className="text-sm leading-relaxed">
                Preverjanje izgovorjave je strukturiran govorni preizkus, s katerim preverjamo otrokovo izgovorjavo soglasnikov slovenskega jezika. Uporablja se za začetno oceno govornega stanja ter za spremljanje napredka skozi čas. Na podlagi preverjanja lahko natančneje prepoznamo, kateri glasovi otroku povzročajo težave in kje potrebuje dodatno vajo.
              </p>
            </section>

            {/* Kaj se preverja */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Kaj se preverja</h3>
              <p className="text-sm leading-relaxed mb-2">
                Pri preverjanju se preverja 20 soglasnikov slovenske abecede. Za vsak soglasnik se izgovorjava preverja v treh položajih:
              </p>
              <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                <li>na začetku besede (označeno kot B – začetek),</li>
                <li>na sredini besede (označeno kot B – sredina),</li>
                <li>na koncu besede (označeno kot B – konec).</li>
              </ul>
              <p className="text-sm leading-relaxed mt-2">
                Na ta način dobimo celostno sliko otrokove izgovorjave posameznega glasu v različnih govornih položajih.
              </p>
            </section>

            {/* Struktura testa */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Struktura preverjanja</h3>
              <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                <li>Otrok izgovarja 60 besed, vsaka beseda je podprta s sliko.</li>
                <li>Slike in besede se prikazujejo v vnaprej določenem vrstnem redu, ki je enak za vse otroke.</li>
                <li>Preverjanje se šteje kot uspešno zaključeno, ko je izgovorjenih vseh 60 besed.</li>
              </ul>
            </section>

            {/* Prikaz napredka */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Prikaz napredka med preverjanjem</h3>
              <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                <li>Na vrhu zaslona so prikazani vsi glasovi soglasnikov, ki se preverjajo.</li>
                <li>Vsak glas ima tri korake (začetek, sredina, konec).</li>
                <li>Ko otrok izgovori prvo besedo za določen glas (npr. za glas B – BIK) in klikne naprej:
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>se polje glasu delno obarva zeleno (1/3),</li>
                    <li>to pomeni, da je otrok izgovoril 1 od 3 besed za ta glas.</li>
                  </ul>
                </li>
                <li>Ko je polje glasu v celoti zeleno, pomeni, da je otrok izgovoril vse tri besede za določen soglasnik.</li>
              </ul>
              <p className="text-sm leading-relaxed mt-2">
                Ta prikaz omogoča jasen in pregleden vpogled v potek preverjanja.
              </p>
              
              {/* Image 1 */}
              <div className="my-4 flex justify-center">
                <img 
                  src={getImageUrl("test_izgovorjave_1.png")} 
                  alt="Prikaz napredka preverjanja" 
                  className="rounded-lg shadow-md max-w-full h-auto"
                  style={{ maxHeight: '300px' }}
                />
              </div>
            </section>

            {/* Kdaj se test izvaja */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Kdaj se preverjanje izvaja</h3>
              <p className="text-sm leading-relaxed mb-2">Preverjanje izgovorjave se opravi:</p>
              <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                <li>ob prvem začetku uporabe aplikacije,</li>
                <li>nato periodično (na vsake tri mesece).</li>
              </ul>
            </section>

            {/* Potek izgovorjave */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Potek izgovorjave posamezne besede</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm leading-relaxed">
                    <strong>1.</strong> Otrok si najprej ogleda sliko. Priporočljivo je, da besedo najprej tiho ponovi pri sebi.
                  </p>
                </div>

                <div>
                  <p className="text-sm leading-relaxed">
                    <strong>2.</strong> Ko je otrok pripravljen na izgovorjavo, klikne gumb »Izgovori besedo«. S tem se začne odštevanje 5 sekund.
                  </p>
                  {/* Image 2 */}
                  <div className="my-3 flex justify-center">
                    <img 
                      src={getImageUrl("bik_1.png")} 
                      alt="Gumb Izgovori besedo" 
                      className="rounded-lg shadow-md max-w-full h-auto"
                      style={{ maxHeight: '280px' }}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm leading-relaxed">
                    <strong>3.</strong> V času odštevanja mora otrok naglas izgovoriti besedo. Izgovorjava se v tem času samodejno posname in shrani.
                  </p>
                </div>

                <div>
                  <p className="text-sm leading-relaxed">
                    <strong>4.</strong> Med odštevanjem je prikazan časovnik.
                  </p>
                  {/* Image 3 */}
                  <div className="my-3 flex justify-center">
                    <img 
                      src={getImageUrl("bik_2.png")} 
                      alt="Časovnik odštevanja" 
                      className="rounded-lg shadow-md max-w-full h-auto"
                      style={{ maxHeight: '280px' }}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm leading-relaxed">
                    <strong>5.</strong> Ko se odštevanje zaključi, se namesto odštevalnika prikaže gumb »Naprej«.
                  </p>
                  {/* Image 4 */}
                  <div className="my-3 flex justify-center">
                    <img 
                      src={getImageUrl("bik_3.png")} 
                      alt="Gumb Naprej" 
                      className="rounded-lg shadow-md max-w-full h-auto"
                      style={{ maxHeight: '280px' }}
                    />
                  </div>
                </div>

                <div>
                  <p className="text-sm leading-relaxed">
                    <strong>6.</strong> S klikom na gumb »Naprej« se otrok premakne na naslednjo besedo oziroma sliko.
                  </p>
                </div>

                <p className="text-sm leading-relaxed mt-4">
                  Postopek se ponavlja, dokler otrok ne izgovori vseh 60 besed in s tem zaključi test.
                </p>
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ArticulationTestInstructionsDialog;
