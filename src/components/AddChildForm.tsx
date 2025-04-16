
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserX } from "lucide-react";
import { SpeechDifficultiesStep } from "./SpeechDifficultiesStep";

// Avatar options for children
const avatarOptions = [
  { id: 0, src: "", alt: "Brez avatarja" },
  { id: 1, src: "/lovable-uploads/39972aa5-2794-48d3-b767-cdab94ecc722.png", alt: "Zmajček s srčastimi očali" },
  { id: 2, src: "/lovable-uploads/fa81df29-e699-4465-a715-5a1fad6e4f15.png", alt: "Zmajček s knjigo" },
  { id: 3, src: "/lovable-uploads/f39a5340-2f93-4a66-b538-f734e037b293.png", alt: "Zmajček s slušalkami" },
  { id: 4, src: "/lovable-uploads/c85cd2ca-023e-4745-8ea5-566e5248866c.png", alt: "Zmajček z rumeno kapo" },
  { id: 5, src: "/lovable-uploads/4fb9709f-60f1-4a5e-ba2a-b5c6e4e4ebb3.png", alt: "Zmajček z rumeno knjigo" },
  { id: 6, src: "/lovable-uploads/d193f7f7-3319-4850-b521-25def4df4ded.png", alt: "Zmajček s pentljo" },
  { id: 7, src: "/lovable-uploads/21b1e7b9-4e9f-48bf-baf5-e715ea31564e.png", alt: "Zmajček z oranžnimi očali" },
  { id: 8, src: "/lovable-uploads/60073b2d-6a27-4159-8026-0cd2e6bbca11.png", alt: "Zmajček z rumenimi slušalkami" },
  { id: 9, src: "/lovable-uploads/475f5cbc-dde5-4fed-884a-dbbbd5a17d71.png", alt: "Zmajček s paleto in čopičem" },
  { id: 10, src: "/lovable-uploads/8a64d05b-708d-4baa-849f-57b582588458.png", alt: "Zmajček s srčastimi očali" },
  { id: 11, src: "/lovable-uploads/1846d8cd-612f-4b7e-b822-e18dfa51f127.png", alt: "Zmajček z rdečo knjigo" },
  { id: 12, src: "/lovable-uploads/15bb01b2-70a8-410f-9d54-47d9492c87d4.png", alt: "Zmajček z mikrofonom" },
  { id: 13, src: "/lovable-uploads/21507abd-a4f2-4d04-b9a8-ffd09a2915d9.png", alt: "Zmajček z očali" },
  { id: 14, src: "/lovable-uploads/f31ff28b-da6d-4077-8763-fe9d77c8dc47.png", alt: "Zmajček z rdečo kapo" },
  { id: 15, src: "/lovable-uploads/b701f301-1a69-4474-bfe7-fd2735224aee.png", alt: "Zmajček z žogo" },
];

enum AddChildStep {
  BASIC_INFO,
  SPEECH_DIFFICULTIES
}

export function AddChildForm({ onSuccess }: { onSuccess?: () => void }) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [gender, setGender] = useState("M");
  const [avatarId, setAvatarId] = useState(1);
  const [speechDifficulties, setSpeechDifficulties] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState<AddChildStep>(AddChildStep.BASIC_INFO);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Prosimo, vnesite ime otroka.");
      return;
    }
    
    setCurrentStep(AddChildStep.SPEECH_DIFFICULTIES);
  };

  const handleSpeechDifficultiesSubmit = async (difficulties: string[]) => {
    if (!user) {
      toast.error("Morate biti prijavljeni za dodajanje otroka.");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Get current user metadata
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      const currentUser = userData.user;
      const currentMetadata = currentUser.user_metadata || {};
      const currentChildren = currentMetadata.children || [];
      
      // Add new child
      const newChild = {
        name: name.trim(),
        gender,
        avatarId,
        speechDifficulties: difficulties
      };
      
      const updatedChildren = [...currentChildren, newChild];
      
      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { children: updatedChildren }
      });
      
      if (updateError) throw updateError;
      
      toast.success("Otrok uspešno dodan!");
      setName("");
      setGender("M");
      setAvatarId(1);
      setSpeechDifficulties([]);
      setCurrentStep(AddChildStep.BASIC_INFO);
      
      if (onSuccess) onSuccess();
      
    } catch (error: any) {
      console.error("Napaka pri dodajanju otroka:", error);
      toast.error("Napaka pri dodajanju otroka. Poskusite znova.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBackToBasicInfo = () => {
    setCurrentStep(AddChildStep.BASIC_INFO);
  };

  if (currentStep === AddChildStep.SPEECH_DIFFICULTIES) {
    return (
      <SpeechDifficultiesStep
        onBack={goBackToBasicInfo}
        onSubmit={handleSpeechDifficultiesSubmit}
        childName={name}
        initialDifficulties={speechDifficulties}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-medium mb-2">Dodaj novega otroka</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="child-name">Ime otroka</Label>
          <Input
            id="child-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Vnesite ime otroka"
            className="mt-1"
            required
          />
        </div>
        
        <div>
          <Label>Spol</Label>
          <RadioGroup 
            value={gender} 
            onValueChange={setGender}
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
        
        <div>
          <Label>Izberi avatarja</Label>
          <div className="grid grid-cols-4 gap-4 mt-3">
            {avatarOptions.map(avatar => (
              <div 
                key={avatar.id}
                onClick={() => setAvatarId(avatar.id)}
                className={`cursor-pointer rounded-lg p-2 transition-all flex items-center justify-center ${
                  avatarId === avatar.id 
                    ? 'bg-dragon-green/20 ring-2 ring-dragon-green' 
                    : 'hover:bg-gray-100'
                }`}
              >
                {avatar.id === 0 ? (
                  <div className="h-[120px] w-[120px] rounded-full flex items-center justify-center bg-gray-100 border border-gray-200">
                    <UserX className="h-10 w-10 text-gray-400" />
                    <span className="sr-only">{avatar.alt}</span>
                  </div>
                ) : (
                  <Avatar className="h-[120px] w-[120px]">
                    <AvatarImage src={avatar.src} alt={avatar.alt} className="object-contain" />
                    <AvatarFallback className="text-xs text-center p-1">
                      {avatar.alt.substring(0, 10)}...
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </div>
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
