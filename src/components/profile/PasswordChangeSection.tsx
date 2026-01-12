import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function PasswordChangeSection() {
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
    <div className="bg-white rounded-lg shadow-sm border border-dragon-green/20 overflow-hidden">
      {/* Header */}
      <div className="bg-dragon-green text-white p-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Spremeni geslo
        </h2>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <form onSubmit={handlePasswordChange} className="space-y-4">
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
          
          <Button 
            type="submit" 
            className="bg-dragon-green hover:bg-dragon-green/90"
            disabled={passwordLoading}
          >
            {passwordLoading ? "Posodabljanje..." : "Spremeni geslo"}
          </Button>
        </form>
      </div>
    </div>
  );
}
