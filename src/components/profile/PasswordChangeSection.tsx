
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Shield, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type PasswordChangeSectionProps = {
  isExpanded: boolean;
  setIsExpanded: () => void;
};

export function PasswordChangeSection({ isExpanded, setIsExpanded }: PasswordChangeSectionProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    
    if (newPassword !== confirmNewPassword) {
      setPasswordError("Novi gesli se ne ujemata");
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError("Geslo mora vsebovati vsaj 6 znakov");
      return;
    }
    
    setPasswordLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      
      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      
      toast.success("Geslo uspešno posodobljeno");
    } catch (error) {
      console.error("Napaka pri posodabljanju gesla:", error);
      setPasswordError("Napaka pri posodabljanju gesla");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded} className="w-full">
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="bg-gradient-to-r from-app-orange/10 to-app-purple/10 flex flex-row items-center justify-between cursor-pointer hover:bg-gradient-to-r hover:from-app-orange/15 hover:to-app-purple/15 transition-colors">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-app-orange" />
              <CardTitle>Spremeni geslo</CardTitle>
            </div>
            <div className="flex items-center gap-1 text-app-orange">
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
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <form onSubmit={handlePasswordChange}>
            <CardContent className="space-y-4 pt-4">
              {passwordError && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                  {passwordError}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">Novo geslo</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Vnesi novo geslo"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmNewPassword">Potrdi novo geslo</Label>
                <Input
                  id="confirmNewPassword"
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Ponovi novo geslo"
                />
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                variant="outline"
                disabled={passwordLoading}
              >
                {passwordLoading ? "Posodabljanje..." : "Spremeni geslo"}
              </Button>
            </CardFooter>
          </form>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
