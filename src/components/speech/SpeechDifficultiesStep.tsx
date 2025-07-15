
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info } from "lucide-react";
import { SpeechHeader } from "./SpeechHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

  const tooltipText = `Kateri glasovi so otroku težavni? (npr. R, L, S, Č, Ž ...)

Kako se težava kaže? (npr. otrok nadomešča glasove, izpušča črke, zamenjuje zvoke ...)

Kdaj ste težavo prvič opazili?

V katerih situacijah se težava najbolj kaže? (npr. doma, v vrtcu, pri hitrem govoru ...)

Ali ste že kaj poskusili? (npr. obisk logopeda, posebne vaje, igre, gledanje govora ...)

Kakšna je otrokova odzivnost? Se rad pogovarja, je zadržan, se jezi, če ga ne razumete?`;

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <SpeechHeader 
          onBack={onBack} 
          childName={childName}
          title="Prvi stik"
          showBackButton={false}
        />

        <div className="space-y-6">
          <p className="text-sm text-gray-700 leading-relaxed">
            Ta razdelek predstavlja prvi stik in oceno otrokovih težav. Zelo pomembno je, da čim bolj natančno opišete, s katerimi glasovi ima otrok težave, saj bo aplikacija na podlagi teh informacij predlagala ustrezne vaje in igre. Če niste prepričani, lahko označite možnost »Nisem prepričan/a« ali »Ne vem« – vseeno pa vam priporočamo, da v spodnjem polju čim bolj podrobno opišete otrokove težave.
          </p>

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
            </div>
          </div>

          <p className="text-xs text-gray-600">
            Otrok ne izgovarja, zamenjuje ali napačno izreka določen glas, ki ga vrstniki njegove starosti že obvladajo.
          </p>

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

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="detailed-description" className="text-sm font-medium">
                Podroben opis težav z govorom
              </Label>
               <Tooltip>
                 <TooltipTrigger asChild>
                   <button type="button" className="text-gray-400 hover:text-gray-600 transition-colors">
                     <Info className="h-4 w-4" />
                   </button>
                 </TooltipTrigger>
                 <TooltipContent 
                   className="max-w-sm p-4 whitespace-pre-line text-sm leading-relaxed z-50"
                   side="bottom"
                   align="start"
                 >
                   <div className="space-y-2">
                     <p>Kateri glasovi so otroku težavni? (npr. R, L, S, Č, Ž ...)</p>
                     <p>Kako se težava kaže? (npr. otrok nadomešča glasove, izpušča črke, zamenjuje zvoke ...)</p>
                     <p>Kdaj ste težavo prvič opazili?</p>
                     <p>V katerih situacijah se težava najbolj kaže? (npr. doma, v vrtcu, pri hitrem govoru ...)</p>
                     <p>Ali ste že kaj poskusili? (npr. obisk logopeda, posebne vaje, igre, gledanje govora ...)</p>
                     <p>Kakšna je otrokova odzivnost? Se rad pogovarja, je zadržan, se jezi, če ga ne razumete?</p>
                   </div>
                 </TooltipContent>
               </Tooltip>
            </div>
            <Textarea
              id="detailed-description"
              value={detailedDescription}
              onChange={(e) => setDetailedDescription(e.target.value)}
              placeholder=""
              className="min-h-32 resize-none"
            />
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
    </TooltipProvider>
  );
}
