
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { SpeechHeader } from "./SpeechHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface SpeechDifficultiesStepProps {
  onBack: () => void;
  onSubmit: (selectedDifficulties: string[], detailedDescription?: string) => void;
  childName: string;
  initialDifficulties?: string[];
  submitButtonText?: string;
}

export function SpeechDifficultiesStep({ 
  onBack, 
  onSubmit, 
  childName,
  initialDifficulties = [],
  submitButtonText = "Naprej"
}: SpeechDifficultiesStepProps) {
  const [hasArticulationDisorder, setHasArticulationDisorder] = useState<boolean>(
    initialDifficulties.includes("articulation")
  );
  const [detailedDescription, setDetailedDescription] = useState<string>("");
  const [dontKnow, setDontKnow] = useState<boolean>(false);
  const [notSure, setNotSure] = useState<boolean>(false);

  const handleArticulationChange = (checked: boolean) => {
    setHasArticulationDisorder(checked);
    if (checked) {
      setDontKnow(false);
      setNotSure(false);
    }
  };

  const handleDontKnowChange = (checked: boolean) => {
    setDontKnow(checked);
    if (checked) {
      setHasArticulationDisorder(false);
      setNotSure(false);
    }
  };

  const handleNotSureChange = (checked: boolean) => {
    setNotSure(checked);
    if (checked) {
      setHasArticulationDisorder(false);
      setDontKnow(false);
    }
  };

  const canSubmit = hasArticulationDisorder || dontKnow || notSure;

  const handleSubmit = () => {
    const selectedDifficulties: string[] = [];
    if (hasArticulationDisorder) {
      selectedDifficulties.push("articulation");
    }
    if (dontKnow) {
      selectedDifficulties.push("dont_know");
    }
    if (notSure) {
      selectedDifficulties.push("not_sure");
    }
    
    onSubmit(selectedDifficulties, detailedDescription);
  };

  return (
    <div className="space-y-6">
      <SpeechHeader 
        onBack={onBack} 
        childName={childName}
        title="Govorne motnje"
        showBackButton={false}
      />

      <div className="space-y-4">
        <p className="text-sm text-gray-700 leading-relaxed">
          Ta razdelek predstavlja prvi stik z oceno otrokovega govora. Zelo pomembno je, da čim natančneje označite, s katerimi glasovi ima otrok težave, saj bo aplikacija na podlagi teh informacij predlagala ustrezne vaje in igre. Če niste prepričani, lahko označite možnost »Nisem prepričan/a« ali »Ne vem« – vseeno pa vam priporočamo, da v spodnjem polju čim bolj podrobno opišete otrokove težave.
        </p>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="articulation"
              checked={hasArticulationDisorder}
              onCheckedChange={handleArticulationChange}
              className="mt-1"
            />
            <div className="flex-1">
              <Label 
                htmlFor="articulation" 
                className="text-sm font-medium cursor-pointer"
              >
                Motnja izreke / artikulacije – dislalija
              </Label>
              <p className="text-xs text-gray-600 mt-1">
                Otrok ne izgovarja, zamenjuje ali napačno izreka določen glas, ki ga vrstniki njegove starosti že obvladajo.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="detailed-description" className="text-sm font-medium">
              Podroben opis težav z govorom
            </Label>
            <Textarea
              id="detailed-description"
              value={detailedDescription}
              onChange={(e) => setDetailedDescription(e.target.value)}
              placeholder="Kateri glasovi so otroku težavni? (npr. R, L, S, Č, Ž ...)

Kako se težava kaže? (npr. otrok nadomešča glasove, izpušča črke, zamenjuje zvoke ...)

Kdaj ste težavo prvič opazili?

V katerih situacijah se težava najbolj kaže? (npr. doma, v vrtcu, pri hitrem govoru ...)

Ali ste že kaj poskusili? (npr. obisk logopeda, posebne vaje, igre, gledanje govora ...)

Kakšna je otrokova odzivnost? Se rad pogovarja, je zadržan, se jezi, če ga ne razumete?"
              className="min-h-32 resize-none"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="dont-know"
                checked={dontKnow}
                onCheckedChange={handleDontKnowChange}
              />
              <Label htmlFor="dont-know" className="text-sm cursor-pointer">
                Ne vem
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="not-sure"
                checked={notSure}
                onCheckedChange={handleNotSureChange}
              />
              <Label htmlFor="not-sure" className="text-sm cursor-pointer">
                Nisem prepričan/a
              </Label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
        <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-amber-800">💡 Opomba za starše:</p>
          <p className="text-sm text-amber-700">
            Če opazite katerega od teh znakov, je priporočljivo posvetovanje z logopedom. 
            Zgodnje odkrivanje motenj omogoča lažje in hitrejše odpravljanje.
          </p>
        </div>
      </div>

      <Button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full bg-dragon-green hover:bg-dragon-green/90 text-base font-medium py-6 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitButtonText}
      </Button>
      
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        onClick={onBack}
        className="w-full flex items-center gap-1"
      >
        <ArrowLeft className="h-4 w-4" />
        Nazaj
      </Button>
    </div>
  );
}
