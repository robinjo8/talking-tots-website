
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { User, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function UserProfileSection({ isExpanded, setIsExpanded }: { 
  isExpanded: boolean; 
  setIsExpanded: (expanded: boolean) => void;
}) {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load existing profile data on component mount
  useState(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        if (data) {
          setUsername(data.username || "");
        }
      } catch (error) {
        console.error("Napaka pri pridobivanju profila:", error);
        toast.error("Napaka pri nalaganju podatkov profila");
      }
    };

    fetchProfile();
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      toast.success("Profil uspešno posodobljen");
    } catch (error) {
      console.error("Napaka pri posodabljanju profila:", error);
      toast.error("Napaka pri posodabljanju profila");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Collapsible 
      open={isExpanded} 
      onOpenChange={setIsExpanded}
      className="w-full"
    >
      <Card>
        <CardHeader className="bg-gradient-to-r from-dragon-green/10 to-app-blue/10 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-6 w-6 text-dragon-green" />
            <CardTitle>Osebni podatki</CardTitle>
          </div>
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1 text-dragon-green hover:bg-dragon-green/10"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  <span className="hidden md:inline">Skrij podrobnosti</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  <span className="hidden md:inline">Prikaži podrobnosti</span>
                </>
              )}
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        
        <CollapsibleContent>
          <form onSubmit={handleProfileUpdate}>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-pošta</Label>
                <Input
                  id="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">E-pošte ni mogoče spremeniti</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Uporabniško ime</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Vnesi uporabniško ime"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Ime</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Vnesi ime"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Priimek</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Vnesi priimek"
                  />
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="bg-dragon-green hover:bg-dragon-green/90"
                disabled={isLoading}
              >
                {isLoading ? "Posodabljanje..." : "Posodobi profil"}
              </Button>
            </CardFooter>
          </form>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
