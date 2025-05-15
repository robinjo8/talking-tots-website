
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Gesli se ne ujemata",
        description: "Prosimo, preverite gesli in poskusite znova.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (authError) {
        throw authError;
      }
      
      if (authData?.user) {
        // Create profile record
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            username,
            email,
            created_at: new Date().toISOString(),
          });
        
        if (profileError) {
          throw profileError;
        }
        
        toast({
          title: "Registracija uspešna",
          description: "Poslan vam je potrditveni e-mail. Prosimo, potrdite svoj račun.",
        });
        
        // Redirect to login page
        navigate("/login");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      
      let errorMessage = "Prišlo je do napake pri registraciji.";
      
      if (error.message) {
        if (error.message.includes("already registered")) {
          errorMessage = "Ta e-poštni naslov je že registriran.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Napaka pri registraciji",
        description: errorMessage,
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
            title="Registracija"
            subTitle="Ustvarite nov uporabniški račun"
          >
            <div className="grid gap-6">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="username">Uporabniško ime</Label>
                    <Input
                      id="username"
                      placeholder="uporabniško ime"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">E-pošta</Label>
                    <Input
                      id="email"
                      placeholder="name@example.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Geslo</Label>
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
                    <Label htmlFor="confirm-password">Potrdite geslo</Label>
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
                    {isLoading ? "Registracija..." : "Registracija"}
                  </Button>
                </div>
              </form>
              <div className="mt-4 text-center text-sm">
                Že imate račun?{" "}
                <Link to="/login" className="underline">
                  Prijava
                </Link>
              </div>
            </div>
          </AuthLayout>
        </div>
      </div>
    </SidebarProvider>
  );
}
