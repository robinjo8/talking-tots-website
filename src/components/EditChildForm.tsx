
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AvatarSelector } from "@/components/AvatarSelector";
import { GenderSelector } from "@/components/GenderSelector";

type ChildData = {
  name: string;
  gender: string;
  avatarId: number;
};

type EditChildFormProps = {
  childIndex: number;
  initialData: ChildData;
  onSuccess: () => void;
  onCancel: () => void;
};

export function EditChildForm({ childIndex, initialData, onSuccess, onCancel }: EditChildFormProps) {
  const { user } = useAuth();
  const [name, setName] = useState(initialData.name);
  const [gender, setGender] = useState(initialData.gender);
  const [avatarId, setAvatarId] = useState(initialData.avatarId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setName(initialData.name);
    setGender(initialData.gender);
    setAvatarId(initialData.avatarId);
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Prosimo, vnesite ime otroka.");
      return;
    }
    
    if (!user) {
      toast.error("Morate biti prijavljeni za urejanje otroka.");
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
      
      // Update child at the specific index
      if (childIndex >= 0 && childIndex < currentChildren.length) {
        currentChildren[childIndex] = {
          name: name.trim(),
          gender,
          avatarId
        };
        
        // Update user metadata
        const { error: updateError } = await supabase.auth.updateUser({
          data: { children: currentChildren }
        });
        
        if (updateError) throw updateError;
        
        toast.success("Otrok uspešno posodobljen!");
        
        if (onSuccess) onSuccess();
      } else {
        toast.error("Napaka pri posodobitvi otroka. Indeks ni veljaven.");
      }
      
    } catch (error: any) {
      console.error("Napaka pri posodobitvi otroka:", error);
      toast.error("Napaka pri posodobitvi otroka. Poskusite znova.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        
        <GenderSelector 
          selectedGender={gender} 
          onGenderChange={setGender}
        />
        
        <AvatarSelector
          selectedAvatarId={avatarId}
          onAvatarSelect={setAvatarId}
        />
      </div>
      
      <div className="pt-4 flex gap-2">
        <Button
          type="submit"
          className="flex-1 bg-dragon-green hover:bg-dragon-green/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Shranjevanje..." : "Shrani spremembe"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Prekliči
        </Button>
      </div>
    </form>
  );
}
