
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AvatarSelector } from "@/components/AvatarSelector";
import { GenderSelector } from "@/components/GenderSelector";

type ChildBasicInfoFormProps = {
  name: string;
  gender: string;
  avatarId: number;
  onNameChange: (name: string) => void;
  onGenderChange: (gender: string) => void;
  onAvatarChange: (id: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
};

export function ChildBasicInfoForm({
  name,
  gender,
  avatarId,
  onNameChange,
  onGenderChange,
  onAvatarChange,
  onSubmit,
  title = "Dodaj novega otroka"
}: ChildBasicInfoFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="child-name">Ime otroka ali vzdevek</Label>
          <Input
            id="child-name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Vnesite ime otroka"
            className="mt-1"
            required
          />
        </div>
        
        <GenderSelector 
          selectedGender={gender} 
          onGenderChange={onGenderChange} 
        />
        
        <AvatarSelector 
          selectedAvatarId={avatarId} 
          onAvatarSelect={onAvatarChange} 
        />
      </div>
      
      <div className="pt-4">
        <Button
          type="submit"
          className="w-full bg-dragon-green hover:bg-dragon-green/90"
        >
          Naprej
        </Button>
      </div>
    </form>
  );
}
