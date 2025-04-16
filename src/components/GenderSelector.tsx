
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type GenderSelectorProps = {
  selectedGender: string;
  onGenderChange: (value: string) => void;
};

export function GenderSelector({ selectedGender, onGenderChange }: GenderSelectorProps) {
  return (
    <div>
      <Label>Spol</Label>
      <RadioGroup 
        value={selectedGender} 
        onValueChange={onGenderChange}
        className="flex space-x-4 mt-1"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="M" id="gender-m" />
          <Label htmlFor="gender-m" className="cursor-pointer">M</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="Ž" id="gender-f" />
          <Label htmlFor="gender-f" className="cursor-pointer">Ž</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="N" id="gender-n" />
          <Label htmlFor="gender-n" className="cursor-pointer">Ne želim izbrati</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
