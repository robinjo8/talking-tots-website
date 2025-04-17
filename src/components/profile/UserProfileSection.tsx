
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type UserProfileSectionProps = {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
};

export function UserProfileSection({ isExpanded, setIsExpanded }: UserProfileSectionProps) {
  const { user, profile } = useAuth();
  const [username, setUsername] = useState(profile?.username || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateUsername = async () => {
    if (!user) return;
    
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from("profiles")
        .update({ username })
        .eq("id", user.id);
      
      if (error) throw error;
      
      toast.success("Uporabniško ime uspešno posodobljeno");
    } catch (error: any) {
      console.error("Napaka pri posodobitvi uporabniškega imena:", error);
      toast.error("Napaka pri posodobitvi uporabniškega imena");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div 
        className="p-4 flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-dragon-green" />
          <h2 className="text-lg font-semibold">Moj profil</h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-0 h-auto"
        >
          {isExpanded ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user?.email || ""}
              readOnly
              className="bg-gray-50"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Email naslov ni mogoče spremeniti
            </p>
          </div>
          
          <div className="mb-4">
            <Label htmlFor="username">Uporabniško ime</Label>
            <div className="flex gap-2">
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Vaše uporabniško ime"
              />
              <Button 
                onClick={handleUpdateUsername}
                disabled={isUpdating || !username.trim()}
              >
                Shrani
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
