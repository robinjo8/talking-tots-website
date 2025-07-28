import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { AvatarSelector } from "@/components/AvatarSelector";
import { GenderSelector } from "@/components/GenderSelector";

type ChildData = {
  name: string;
  gender: string;
  avatarId: number;
  birthDate?: Date | null;
};

type EditChildFormProps = {
  childIndex: number;
  initialData: ChildData;
  onSuccess: () => void;
  onCancel: () => void;
};

export function EditChildForm({ childIndex, initialData, onSuccess, onCancel }: EditChildFormProps) {
  const { user, refreshProfile } = useAuth();
  const [name, setName] = useState(initialData.name);
  const [gender, setGender] = useState(initialData.gender);
  const [avatarId, setAvatarId] = useState(initialData.avatarId);
  const [birthDate, setBirthDate] = useState<Date | null>(initialData.birthDate || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setName(initialData.name);
    setGender(initialData.gender);
    setAvatarId(initialData.avatarId);
    setBirthDate(initialData.birthDate || null);
  }, [initialData]);

  const calculateAge = (birthDate: Date | null): number => {
    if (!birthDate) return 4; // Default age
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return Math.max(age, 3); // Minimum age 3
  };

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
      
      const calculatedAge = calculateAge(birthDate);
      
      // Update in database first
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      
      const { data: children, error: fetchError } = await supabase
        .from('children')
        .select('*')
        .eq('parent_id', userData.user.id)
        .order('created_at', { ascending: true });
      
      if (fetchError) throw fetchError;
      
      if (children && childIndex >= 0 && childIndex < children.length) {
        const childToUpdate = children[childIndex];
        
        const { error: updateError } = await supabase
          .from('children')
          .update({
            name: name.trim(),
            gender,
            age: calculatedAge,
            birth_date: birthDate ? 
              new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate())
                .toISOString().split('T')[0] : null,
            avatar_url: `/lovable-uploads/avatar-${avatarId}.png`
          })
          .eq('id', childToUpdate.id);
        
        if (updateError) throw updateError;
        
        // Also update metadata for compatibility
        const currentMetadata = userData.user.user_metadata || {};
        const metadataChildren = [...(currentMetadata.children || [])];
        
        if (metadataChildren[childIndex]) {
          metadataChildren[childIndex] = {
            ...metadataChildren[childIndex],
            name: name.trim(),
            gender,
            avatarId,
            birthDate,
            age: calculatedAge
          };
          
          await supabase.auth.updateUser({
            data: { children: metadataChildren }
          });
        }
        
        // Refresh the profile to get updated data
        await refreshProfile();
        
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

        <div className="space-y-2">
          <Label htmlFor="birth-date">Datum rojstva otroka</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="birth-date"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !birthDate && "text-muted-foreground"
                )}
              >
                {birthDate ? format(birthDate, "dd.MM.yyyy") : "Izberite datum rojstva"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={birthDate}
                onSelect={setBirthDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
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
