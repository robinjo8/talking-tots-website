
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if the URL contains a reset token or hash
  useEffect(() => {
    const handlePasswordRecovery = async () => {
      const hash = window.location.hash;
      if (hash && hash.includes("type=recovery")) {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error.message);
          toast({
            title: "Napaka",
            description: "Napaka pri obnovitvi seje. Prosimo, poskusite ponovno zahtevati ponastavitev gesla.",
            variant: "destructive",
          });
        }
        
        if (!data.session) {
          console.log("No active session found with recovery token");
        }
      }
    };
    
    handlePasswordRecovery();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Gesli se ne ujemata",
        description: "Prosimo, preverite, da se gesli ujemata.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Geslo posodobljeno",
        description: "Vaše geslo je bilo uspešno posodobljeno.",
      });
      
      navigate("/login");
    } catch (error: any) {
      console.error("Update password error:", error);
      toast({
        title: "Napaka",
        description: error.message || "Prišlo je do napake pri posodobitvi gesla.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center pt-16">
          <AuthLayout
            title="Posodobi geslo"
            subtitle="Vnesite svoje novo geslo"
          >
            <div className="grid gap-6">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="password">Novo geslo</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirm-password">Potrdite novo geslo</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <Button disabled={isLoading}>
                    {isLoading ? "Posodabljanje..." : "Posodobi geslo"}
                  </Button>
                </div>
              </form>
            </div>
          </AuthLayout>
        </div>
      </div>
    </SidebarProvider>
  );
}
