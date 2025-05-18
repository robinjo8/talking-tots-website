
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/login");
        toast.error("Seja je potekla. Prosimo, prijavite se ponovno.");
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!password || !confirmPassword) {
      setError("Prosimo, izpolnite vsa polja.");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Gesli se ne ujemata.");
      return;
    }
    
    if (password.length < 6) {
      setError("Geslo mora vsebovati vsaj 6 znakov.");
      return;
    }
    
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) throw error;
      
      toast.success("Geslo je bilo uspešno posodobljeno!");
      navigate("/");
    } catch (error: any) {
      console.error("Napaka pri posodobitvi gesla:", error);
      setError("Prišlo je do napake pri posodobitvi gesla. Poskusite znova.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Posodobite geslo" 
      subtitle="Ustvarite novo geslo za vaš račun."
    >
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Novo geslo</Label>
            <Input
              id="password"
              type="password"
              placeholder="Vnesite novo geslo"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-md text-base"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Potrdite novo geslo</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Ponovno vnesite novo geslo"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="rounded-md text-base"
              required
            />
          </div>
        </div>
        
        <Button
          type="submit"
          className="w-full bg-dragon-green hover:bg-dragon-green/90 text-base font-medium py-6"
          disabled={isLoading}
        >
          {isLoading ? "Posodabljanje..." : "Posodobi geslo"}
        </Button>
      </form>
    </AuthLayout>
  );
}
