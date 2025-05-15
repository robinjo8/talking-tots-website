
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  // If already logged in, redirect to home
  useEffect(() => {
    if (user) {
      console.log("User already authenticated, redirecting to: /");
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Napaka pri prijavi",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Uspešna prijava",
        description: "Dobrodošli nazaj!",
      });
      
      // Redirect to homepage after successful login
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Napaka pri prijavi",
        description: "Preverite podatke in poskusite znova.",
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
            title="Prijava"
            subtitle="Vnesite svoje podatke za prijavo"
          >
            <div className="grid gap-6">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
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
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Geslo</Label>
                      <Link
                        to="/reset-password"
                        className="text-sm text-muted-foreground hover:underline"
                      >
                        Ste pozabili geslo?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <Button disabled={isLoading}>
                    {isLoading ? "Prijavljanje..." : "Prijava"}
                  </Button>
                </div>
              </form>
              <div className="mt-4 text-center text-sm">
                Nimate računa?{" "}
                <Link to="/register" className="underline">
                  Registracija
                </Link>
              </div>
            </div>
          </AuthLayout>
        </div>
      </div>
    </SidebarProvider>
  );
}
